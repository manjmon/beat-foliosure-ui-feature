import { TestBed } from '@angular/core/testing';
import { TrackrecordSymbol } from './deal-dynamicsymbol.pipe';
describe('trackrecordSymbolPipe', () => {
  let pipe: TrackrecordSymbol;

  beforeEach(() => {
    pipe = new TrackrecordSymbol();
    TestBed.configureTestingModule({ providers: [TrackrecordSymbol] });

  });

  it('can load instance', () => {
    expect(pipe).toBeTruthy();
  });
  
});