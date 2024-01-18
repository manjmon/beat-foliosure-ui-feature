
import { FormControl } from '@angular/forms';
import { TagsValidator } from './tags-validator';

describe('TagsValidator', () => {
  let validator: TagsValidator;

  beforeEach(() => {
    validator = new TagsValidator();
  });


  it('should invalidate a duplicate tag', () => {
    const control = new FormControl('tag1');
    validator.tags = ['tag1', 'tag2'];

    const errors = validator.validate(control);

    expect(errors).toEqual({ duplicateTags: true });
  });

  

  it('should ignore null or undefined tags', () => {
    const control = new FormControl();
    validator.tags = ['tag1', 'tag2'];

    const errors = validator.validate(control);

    expect(errors).toBeNull();
  });
});