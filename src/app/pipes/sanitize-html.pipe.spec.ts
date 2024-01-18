import { DomSanitizer } from '@angular/platform-browser';
import { SanitizeHtmlPipe } from './sanitize-html.pipe';

describe('SanitizeHtmlPipe', () => {
let pipe: SanitizeHtmlPipe;
let sanitizer: DomSanitizer;

beforeEach(() => {
sanitizer = jasmine.createSpyObj('DomSanitizer', ['bypassSecurityTrustHtml']);
pipe = new SanitizeHtmlPipe(sanitizer);
});

it('can load instance', () => {
    expect(pipe).toBeTruthy();
  });

it('should return the input value if it is undefined or null', () => {
expect(pipe.transform(undefined)).toBe(undefined);
expect(pipe.transform(null)).toBe(null);
});

});

