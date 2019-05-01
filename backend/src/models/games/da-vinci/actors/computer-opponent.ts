import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { GameDaVinci } from '../service';
import { GamePiece, Guess, Hand, PieceColor, PieceState } from '../utils';
import { ColorRequestEvent } from '../utils/color-request-event';
import { GameAction } from '../utils/extra-action.enum';
import { Actor } from './actor';

export class ComputerOpponent implements Actor {
  readonly id: number = Actor.getId();
  readonly name: string;
  private unsortedHand: Array<GamePiece> = [];

  private handEmitter = new BehaviorSubject(this.privateHand);

  private sentMessages: Array<string> = [];
  private opponentHands: Array<Hand> = [];

  get lifes(): Number {
    return this.unsortedHand.filter(piece => GamePiece.isPrivate(piece)).length;
  }

  private get privateHand(): Array<GamePiece> {
    return this.unsortedHand.sort((a, b) => GamePiece.compare(a, b));
  }

  private get privateHand$(): Observable<Array<GamePiece>> {
    return this.handEmitter.asObservable();
  }

  private get gameSetup() {
    return {
      colors: this.service.COLORS,
      piecePerColor: this.service.PIECE_PER_COLOR,
    };
  }

  get publicHand$(): Observable<Array<GamePiece>> {
    return this.privateHand$.pipe(
      map(hand =>
        hand.map(piece =>
          GamePiece.isPrivate(piece) ? GamePiece.hide(piece) : piece
        )
      )
    );
  }

  private readonly SUBSCRIPTIONS: Array<Subscription> = []; // event subscriptions

  constructor(private service: GameDaVinci, name: string) {
    this.name = name;
  }

  checkGuess(guess: Guess): boolean {
    return this.privateHand[guess.position].number === guess.value;
  }

  takePiece(piece: GamePiece) {
    this.unsortedHand.push(piece);
    this.handEmitter.next(this.privateHand);
    console.log('AI HAND:');
    console.log(this.privateHand);
  }

  showPiece(position: number): void {
    this.privateHand[position].state = PieceState.PUBLIC;
    this.handEmitter.next(this.privateHand);
  }

  async init(): Promise<void> {
    this.SUBSCRIPTIONS.push(
      this.service.infoMessage$.subscribe(message => {
        this.sentMessages.push(message);
      })
    );

    this.SUBSCRIPTIONS.push(
      this.service.publicHands$.subscribe(update => {
        this.opponentHands = update.filter(hand => hand.userName !== this.name);
      })
    );

    return Promise.resolve();
  }

  async makeAGuess(): Promise<Guess> {
    const guesserLogic = new Logic(
      this.service,
      this.opponentHands,
      this.privateHand
    );
    return this.delay(2000).then(() => guesserLogic.bestGuess.guess);
  }

  async chooseAColorToTake(
    requestInfo: ColorRequestEvent
  ): Promise<PieceColor> {
    console.log('taking color request');
    const guesserLogic = new Logic(
      this.service,
      this.opponentHands,
      this.privateHand
    );
    return this.delay(2000).then(() =>
      guesserLogic.getbestColor(requestInfo.availableColors)
    );
  }

  async chooseExtraAction(
    availableActions: Array<GameAction>
  ): Promise<GameAction> {
    const guesserLogic = new Logic(
      this.service,
      this.opponentHands,
      this.privateHand
    );
    let choosenAction: GameAction;
    if (guesserLogic.bestGuess.certanty >= guesserLogic.certantyThreshold) {
      choosenAction = GameAction.GUESS;
    } else if (availableActions.includes(GameAction.PICK)) {
      choosenAction = GameAction.PICK;
    } else {
      choosenAction = GameAction.GUESS;
    }

    return this.delay(2000).then(() => choosenAction);
  }

  async gameOver(winnerName: string): Promise<void> {
    this.cleanUp();
    return Promise.resolve();
  }

  async gameStart(): Promise<void> {
    return Promise.resolve();
  }

  private cleanUp(): void {
    this.SUBSCRIPTIONS.forEach(subscription => subscription.unsubscribe());
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        clearTimeout(timeout);
        resolve();
      }, ms);
    });
  }
}

class Logic {
  get bestGuess(): { guess: Guess; certanty: number } {
    const bestGuess = this.orderedGuesses[0];
    const userName = bestGuess.guess.userName;
    const position = bestGuess.guess.position;
    const value = Math.floor(Math.random() * bestGuess.values.length);

    const guess = new Guess(userName, position, bestGuess.values[value]
      .number as number);
    const certanty = 1 / bestGuess.values.length;
    console.log('AI GUESS');
    console.log({ guess, certanty });
    return { guess, certanty };
  }

  get certantyThreshold(): number {
    const piecesInPlay =
      this.opponentHands.reduce<number>(
        (sum, opponent) => (sum += opponent.hand.length),
        0
      ) + this.aiHand.length;
    const piecesTotal = this.colors * this.piecePerColor;
    const lives = this.aiHand.filter(piece => GamePiece.isPrivate(piece))
      .length;
    const fearOfDeathModifier = 0.4 - lives >= 4 ? 0.4 : lives / 10;
    const x = piecesInPlay / piecesTotal + fearOfDeathModifier;

    console.log('certantyThreshold: ' + Math.min(1.0, Math.cos(1.2 * x) * 1.2));

    return Math.min(1.0, Math.cos(1.2 * x) * 1.2);
  }

  getbestColor(availableColors: Array<PieceColor>): PieceColor {
    const opponentsColors = this.opponentHands.map(opponent =>
      this.handToPiecesPerColor(opponent.hand)
    );
    const aiColors = this.handToPiecesPerColor(this.aiHand);

    const desiresPerOpponent = opponentsColors.map(opponentColors =>
      this.mapColorToDesire(opponentColors, aiColors, availableColors)
    );
    const summedDesires = availableColors.map(
      color =>
        desiresPerOpponent
          .map(desire => desire[color])
          .reduce((prev, curr) => (curr += prev)) / this.opponentHands.length
    );
    const normalizationRate =
      1 / summedDesires.reduce((prev, act) => (act += prev));
    const desiresRandomVariable = summedDesires.map(
      desire => desire * normalizationRate
    );

    let outcome = Math.random();
    console.log('color desires:');
    console.log(availableColors.map(color => PieceColor[color]));
    console.log(desiresRandomVariable);
    console.log(outcome);
    for (let i = 0; i < desiresRandomVariable.length; i++) {
      if (desiresRandomVariable[i] >= outcome) {
        console.log('outcome: ' + PieceColor[availableColors[i]]);
        return availableColors[i];
      } else {
        outcome -= desiresRandomVariable[i];
      }
    }
  }

  private get orderedGuesses(): Array<{
    guess: Guess;
    values: Array<GamePiece>;
  }> {
    const guessesWithNeighboor = this.allGuesses.map(guess => ({
      guess,
      values: this.getPossiblePiecesByNeighboors(guess),
    }));
    const guessesFilteredForMissing = guessesWithNeighboor.map(guess => ({
      guess: guess.guess,
      values: this.filterForMissing(guess.values),
    }));
    console.log('orderesGuesses:');
    guessesFilteredForMissing
      .sort((a, b) =>
        a.values.length > b.values.length
          ? 1
          : a.values.length < b.values.length
          ? -1
          : 0
      )
      .forEach(guess => {
        console.log('position: ' + guess.guess.position);
        console.log('values ' + guess.values.map(value => value.number + ' '));
      });
    return guessesFilteredForMissing.sort((a, b) =>
      a.values.length > b.values.length
        ? 1
        : a.values.length < b.values.length
        ? -1
        : 0
    );
  }

  private get missingPieces(): Array<GamePiece> {
    const allPieces = this.allPieces;
    this.opponentHands.forEach(opponent =>
      opponent.hand
        .filter(piece => GamePiece.isPublic(piece))
        .forEach(piece => {
          const index =
            piece.color * this.piecePerColor + (piece.number as number);
          allPieces[index].state = PieceState.PUBLIC;
        })
    );
    this.aiHand.forEach(piece => {
      const index = piece.color * this.piecePerColor + (piece.number as number);
      allPieces[index].state = piece.state;
    });

    return allPieces.filter(piece => GamePiece.isMissing(piece));
  }

  private get allPieces(): Array<GamePiece> {
    const pieces = this.colors * this.piecePerColor;
    return new Array(pieces)
      .fill(0)
      .map(
        (v, index) =>
          new GamePiece(
            index % this.piecePerColor,
            Math.floor(index / this.piecePerColor)
          )
      );
  }

  private get allGuesses(): Array<Guess> {
    const guesses: Array<Guess> = [];
    this.opponentHands.forEach(opponent =>
      opponent.hand.forEach((piece, index) => {
        if (GamePiece.isPrivate(piece)) {
          guesses.push(new Guess(opponent.userName, index, -1));
        }
      })
    );
    return guesses;
  }

  private get colors(): number {
    return this.service.COLORS as number;
  }

  private get piecePerColor(): number {
    return this.service.PIECE_PER_COLOR as number;
  }

  constructor(
    private readonly service: GameDaVinci,
    private readonly opponentHands: Array<Hand>,
    private readonly aiHand: Array<GamePiece>
  ) {}

  // TODO: WRITE UNIT TESTS FOR THIS METHOD
  private getPossiblePiecesByNeighboors(guess: Guess): Array<GamePiece> {
    let leftBoundary = 0;
    let rightBoundary = this.piecePerColor - 1;
    const opponent = this.opponentHands.find(
      opp => opp.userName === guess.userName
    );
    const targetColor = opponent.hand[guess.position].color;

    // In both cases we iterate over the neighbooring elements starting from our guess's position
    // Upon finding a reference piece(piece with public value), we calculate the boundary, so that we can have a range of numbers that could be the value of our guessed piece.
    // Boundary is adjusted for colors precedence.

    for (let dist = 1; guess.position + dist < opponent.hand.length; dist++) {
      const currentPiece = opponent.hand[guess.position + dist];
      const prevPiece = opponent.hand[guess.position + dist - 1];
      if (prevPiece.color >= currentPiece.color) {
        rightBoundary--;
      }
      if (GamePiece.isPublic(currentPiece)) {
        rightBoundary =
          (currentPiece.number as number) -
          (this.piecePerColor - 1 - rightBoundary);
        break;
      }
    }

    for (let dist = 1; guess.position - dist >= 0; dist++) {
      const currentPiece = opponent.hand[guess.position - dist];
      const prevPiece = opponent.hand[guess.position - dist + 1];
      if (currentPiece.color >= prevPiece.color) {
        leftBoundary++;
      }
      if (GamePiece.isPublic(currentPiece)) {
        leftBoundary += currentPiece.number as number;
        break;
      }
    }

    const pieces: Array<GamePiece> = [];
    console.log(
      'for guess poss:' +
        guess.position +
        ' leftBoundary: ' +
        leftBoundary +
        ' rightBoundary: ' +
        rightBoundary
    );

    for (let i = Math.floor(leftBoundary); i <= Math.ceil(rightBoundary); i++) {
      pieces.push(new GamePiece(i, targetColor));
    }
    return pieces;
  }

  private filterForMissing(pieces: Array<GamePiece>): Array<GamePiece> {
    const missingPieces = this.missingPieces;
    return pieces.filter(
      piece =>
        !!missingPieces.find(
          missing =>
            missing.color === piece.color && missing.number === piece.number
        )
    );
  }

  private mapColorToDesire(
    opponent: Array<number>,
    ai: Array<number>,
    availableColors: Array<PieceColor>
  ): Array<number> {
    /*
    NEKEM:   NEKI:   SZÁNDÉK(1-5): MARADÉK>2    SZÁNDÉK(1-5): MARADÉK<3
    100%     0%                2                          1
    70%      30%               4                          1
    50%      50%               4                          1
    30%      70%               3                          5
    0%       100%              2                          5
    */

    const desireWithManyRemaining = (x: number) =>
      Math.sin(x / 0.32) * 0.67 + 0.13;
    const desireWithFewRemaining = (x: number) =>
      Math.min(1, Math.max(0, Math.sin((x + 0.7) / 0.37) + 0.16));

    const colorDesires = Array<number>(this.colors);
    availableColors.forEach(color => {
      const totalLocalPieces = opponent[color] + ai[color];
      if (totalLocalPieces === 0) {
        colorDesires[color] = 0.6;
        return;
      }
      const remainingPieces = this.piecePerColor - totalLocalPieces;

      const x = ai[color] / totalLocalPieces;

      colorDesires[color] =
        remainingPieces > 2
          ? desireWithManyRemaining.call(undefined, x)
          : desireWithFewRemaining.call(undefined, x);
    });

    return colorDesires;
  }

  private handToPiecesPerColor(hand: Array<GamePiece>): Array<number> {
    return hand.reduce<Array<number>>((prev, curr) => {
      prev[curr.color]++;
      return prev;
    }, new Array<number>(this.colors).fill(0));
  }
}
