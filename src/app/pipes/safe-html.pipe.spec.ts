import { Pipe, PipeTransform } from '@angular/core';
import { SafeHtmlPipe } from './safe-html.pipe';

describe('SafeHtmlPipe', () => {
  let pipe: SafeHtmlPipe;

  beforeEach(() => {
    pipe = new SafeHtmlPipe();
  });

  it('can load instance', () => {
    expect(pipe).toBeTruthy();
  });
  
  it('should parse HTML strings', () => {
    const htmlString = '<p>Hello, world!</p>';
    const parsedHtml = pipe.transform(htmlString);

    expect(parsedHtml).toBe('Hello, world!');
  });
});