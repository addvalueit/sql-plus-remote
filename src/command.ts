import * as vscode from 'vscode';
import {TerminalState, ProfileConfiguration, ConnectionString} from './data';  
  let activeTerminalProfile : TerminalState | undefined;
  
  // Funzione per ottenere il profilo da utilizzare
  function getProfile() {
    // Ottieni la configurazione dell'estensione
    const configuration = vscode.workspace.getConfiguration('plsql-executor');
  
    // Ottieni il profilo da utilizzare
    let profile = configuration.get('defaultProfile');
  
    // Se il profilo non è definito, impostalo sul profilo predefinito
    if (!profile) {
      vscode.window.showErrorMessage('Default profile not set! Please check your configuration');
    }
  
    // Ritorna il profilo
    return profile;
  }
  
  // Funzione per eseguire il comando "@<percorsofileaperto>;"
  export function runSqlFile() {
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
            terminal.sendText(`@"${filename}";`);
          }
        }else{
          vscode.window.showErrorMessage('Nessuno script selezionato');
        }
    }
  
  
  // Funzione per lanciare il terminale con PLSQL
  export function launchTerminal() {
    // Ottieni il profilo da utilizzare
    const profile = getProfile();
    const configuration= vscode.workspace.getConfiguration('plsql-executor');
    if (configuration && profile && typeof profile === 'string') {
      const availableProfile  = configuration.get(`profiles`) as Array<ProfileConfiguration> | undefined;
      if (!availableProfile){
        vscode.window.showErrorMessage('You must configure your configuration inside settings');
      }
      const activeProfile = availableProfile?.find((it) => {return it.name === profile;});
      // Ottieni la stringa di connessione dal profilo
      const sqlplusPath = configuration.get('sqlplusPath');
      let params = ''; 
      if (activeProfile ) {
        const connectionString = activeProfile.connectionString;
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
  
  