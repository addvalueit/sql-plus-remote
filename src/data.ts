import * as vscode from 'vscode';

export type ConnectionString = {
    user: string;
    password: string;
    dbAddress: string;
    dbService: string;
  };
  
  export type ProfileConfiguration = {
    name: string;
    connectionString: ConnectionString;
  };
  
  export interface TerminalState {
    profile: string;
    terminalName: string;
    terminal: vscode.Terminal
  };