import * as vscode from 'vscode';
import { TerminalState, ProfileConfiguration, ConnectionString } from './data';

let activeTerminalProfile: TerminalState | undefined;
let availableProfileConfiguration: Array<ProfileConfiguration> | undefined;
let sqlplusPath: string | undefined;
let activeProfileConfiguration: ProfileConfiguration;

// Funzione per ottenere il profilo da utilizzare
export function loadConfiguration() {
  // Ottieni la configurazione dell'estensione
  const configuration = vscode.workspace.getConfiguration('plsql-executor');
  sqlplusPath = configuration.get('sqlplusPath');
  let activeProfileName: string | undefined;
  // Ottieni il profilo da utilizzare
  const defaultProfile = configuration.get('defaultProfile') as string;
  if (defaultProfile) {
    activeProfileName = defaultProfile;
  } else {
    selectProfile();
  }

  availableProfileConfiguration = configuration.get(`profiles`) as Array<ProfileConfiguration> | undefined;
  if (!availableProfileConfiguration) {
    vscode.window.showErrorMessage('You must configure your configuration inside settings');
  }

  // Se il profilo non è definito, impostalo sul profilo predefinito
  if (!activeProfileName) {
    vscode.window.showErrorMessage('Default profile not set! Please check your configuration');
  } else {
    const find = availableProfileConfiguration?.find((it) => { return it.name === activeProfileName; });
    if (find) {
      activeProfileConfiguration = find;
    }
  }
}

// Funzione per eseguire il comando "@<percorsofileaperto>;"
export function runSqlFile() {
  if (!activeTerminalProfile) {
    launchTerminal();
  }
  if (activeTerminalProfile) {
    const terminal = activeTerminalProfile.terminal;
    if (terminal.exitStatus) {
      launchTerminal();
    }
  }
  // Ottieni il percorso del file aperto
  const activeFile = vscode.window.activeTextEditor;
  if (activeFile) {
    const filename = activeFile.document.fileName;
    // Apri un terminale
    if (activeTerminalProfile) {
      const terminal = activeTerminalProfile.terminal;
      terminal.show(true);
      // Esegui il comando "@<percorsofileaperto>;"
      terminal.sendText(`@"${filename}";`);
    }
  } else {
    vscode.window.showErrorMessage('Nessuno script selezionato');
  }
}


// Funzione per lanciare il terminale con PLSQL
export function launchTerminal() {
  // Ottieni il profilo da utilizzare

  // Ottieni la stringa di connessione dal profilo 
  let params = '';
  if (activeProfileConfiguration) {
    const connectionString = activeProfileConfiguration.connectionString;
    params = `${connectionString.user}/${connectionString.password}@${connectionString.dbAddress}/${connectionString.dbService}`;
  }

  activeTerminalProfile = {
    profile: activeProfileConfiguration?.name,
    terminalName: `PLSQL Plus - ${activeProfileConfiguration?.name}`,
    terminal: vscode.window.createTerminal(`PLSQL Plus - ${activeProfileConfiguration?.name}`, `${sqlplusPath}/sqlplus.exe`, params)
  };
  // Apri un terminale
  if (activeTerminalProfile.terminal) {
    activeTerminalProfile.terminal.show();
  }
}

export function selectProfile() {
  if (availableProfileConfiguration) {
    let test = availableProfileConfiguration.map<vscode.QuickPickItem>(it => { return { label: it.name }; });
    console.log(test);
    const profileAvaliable: vscode.QuickPickItem[] = test;
    if (profileAvaliable) {
      const select = vscode.window.showQuickPick(profileAvaliable);
      select.then(ele => {
        const find = availableProfileConfiguration?.find((it) => { return it.name === ele?.label; });
        if (find) {
          activeProfileConfiguration = find;
        }
      }
      );

    } else {
      vscode.window.showErrorMessage('Nessun profilo disponibile! Controlla la configurazione');
    }
  }
}

