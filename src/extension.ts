// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

type ConnectionString = {
  user: string;
  password: string;
  dbAddress: string;
  dbService: string;
};

type ProfileConfiguration = {
  connectionString: ConnectionString;
};

interface TerminalExt {
  profile: string;
  terminalName: string;
  terminal: vscode.Terminal
};

let activeTerminalProfile : TerminalExt | undefined;

// Funzione per ottenere il profilo da utilizzare
function getProfile() {
  // Ottieni la configurazione dell'estensione
  const configuration = vscode.workspace.getConfiguration('plsql-executor');

  // Ottieni il profilo da utilizzare
  let profile = configuration.get('profile');

  // Se il profilo non è definito, impostalo sul profilo predefinito
  if (!profile) {
    profile = 'dev';
  }

  // Ritorna il profilo
  return profile;
}

// Funzione per eseguire il comando "@<percorsofileaperto>;"
function runSqlFile() {
  if (!activeTerminalProfile) {
    launchTerminal();
  }
  if (activeTerminalProfile){
  const terminal = activeTerminalProfile.terminal;
    if (terminal.exitStatus) {
      launchTerminal();
    }
  }
  // Ottieni il percorso del file aperto
  const activeFile = vscode.window.activeTextEditor;
  if (activeFile){
      const filename = activeFile.document.fileName;
      // Apri un terminale
        if(activeTerminalProfile){
          const terminal = activeTerminalProfile.terminal;
          terminal.show(true);
          // Esegui il comando "@<percorsofileaperto>;"
          terminal.sendText(`@${filename};`);
        }
      }else{
        console.log('Nessuno script selezionato');
        vscode.window.showErrorMessage('Nessuno script selezionato');
      }
  }


// Funzione per lanciare il terminale con PLSQL
function launchTerminal() {
  // Ottieni il profilo da utilizzare
  const profile = getProfile();
  const configuration= vscode.workspace.getConfiguration('plsql-executor');
  if (configuration && profile && typeof profile === 'string') {
    const activeProfile  = configuration.get(`profiles.${profile}`) as ProfileConfiguration | undefined;
    // Ottieni la stringa di connessione dal profilo
    const sqlplusPath = configuration.get('sqlplusPath');
    let params = ''; 
    if (activeProfile ) {
      const connectionString:ConnectionString = activeProfile.connectionString;
      params = `${connectionString.user}/${connectionString.password}@${connectionString.dbAddress}/${connectionString.dbService}`;
    }

    activeTerminalProfile = {
      profile: profile,
      terminalName : `PLSQL Plus - ${profile}`,
      terminal: vscode.window.createTerminal(`PLSQL Plus - ${profile}`, `${sqlplusPath}/sqlplus.exe`, params )
    };
    // Apri un terminale
    if (activeTerminalProfile.terminal){
      activeTerminalProfile.terminal.show();
    }
  }
}

// Registri gli handler degli eventi



// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "plsql-executor" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let lunch = vscode.commands.registerCommand('plsql-executor.launchTerminal', launchTerminal);
	let run = vscode.commands.registerCommand('plsql-executor.runSqlFile', runSqlFile);

	context.subscriptions.push(lunch, run);
}

// This method is called when your extension is deactivated
export function deactivate() {}
