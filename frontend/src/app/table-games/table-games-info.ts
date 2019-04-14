import { DavinciModule } from './da-vinci/davinci.module';

export class TableGameInfo {
  readonly title: string;
  readonly aiSupported: boolean;
  readonly path: string;
  readonly maxPlayers: number;
  readonly minPlayers: number;

  static get list(): Array<TableGameInfo> {
    return [TableGameInfo.daVinciGameInfo()];
  }

  private static daVinciGameInfo(): TableGameInfo {
    const title = 'Da Vinci';
    const aiSupported = false;
    const path = 'da-vinci';
    const maxPlayers = 5;
    const minPlayers = 2;

    return new TableGameInfo(title, aiSupported, path, maxPlayers, minPlayers);
  }

  private constructor(
    title: string,
    aiSupported: boolean,
    path: string,
    maxPlayers: number,
    minPlayers: number
  ) {
    this.title = title;
    this.aiSupported = aiSupported;
    this.path = path;
    this.maxPlayers = maxPlayers;
    this.minPlayers = minPlayers;
  }
}
