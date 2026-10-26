import { inputLimit, parseResult, SOURCE_LIMIT } from './protocol';

test('source and input limits count UTF-8 bytes', () => {
  expect(inputLimit('x'.repeat(SOURCE_LIMIT), '')).toBeNull();
  expect(inputLimit('я'.repeat(SOURCE_LIMIT / 2 + 1), '')).toBe('source-limit');
  expect(inputLimit('print(1)', 'x'.repeat(8193))).toBe('input-limit');
});

test('only bounded terminal messages can enter the application', () => {
  expect(parseResult({ type: 'result', status: 'completed', output: '<script>text</script>', }))
    .toEqual({ status: 'completed', output: '<script>text</script>', });
  for (const packet of [null, 'result', {},
    { type: 'result', status: 'completed', output: 'x'.repeat(16385), },
    { type: 'result', status: 'completed', output: '\n'.repeat(201), },
    { type: 'result', status: 'completed', output: 'я'.repeat(8193), },
    { type: 'result', status: 'navigate', output: 'https://example.test', },
    { type: 'result', status: 'completed', output: { html: 'unsafe', }, }
  ]) expect(parseResult(packet)).toBeNull();
});
