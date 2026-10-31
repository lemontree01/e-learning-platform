import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createAppI18n } from './i18n';

const localeDirectory = resolve(__dirname, '../../../public/locales');

function leaves (value: unknown, prefix = ''): Record<string, string> {
  if (typeof value === 'string') return { [prefix]: value, };
  expect(value).not.toBeNull();
  expect(typeof value).toBe('object');
  return Object.fromEntries(Object.entries(value as Record<string, unknown>).flatMap(
    ([key, child]) => Object.entries(leaves(child, prefix ? `${prefix}.${key}` : key))
  ));
}

const baseKey = (key: string) => key.replace(/_(zero|one|two|few|many|other)$/, '');
const placeholders = (value: string) => [...value.matchAll(/\{\{\s*([^}]+?)\s*\}\}|\$(?:\d+)?/g)]
  .map(match => match[1] ?? match[0]).sort();

test('each language has one JSON source of truth', () => {
  expect(readdirSync(localeDirectory, { recursive: true, })
    .map(String).filter(name => name.endsWith('.json')).sort()).toEqual(['en.json', 'ru.json']);
});

test('English and Russian have matching, nonempty copy and interpolation variables', () => {
  const en = leaves(JSON.parse(readFileSync(resolve(localeDirectory, 'en.json'), 'utf8')));
  const ru = leaves(JSON.parse(readFileSync(resolve(localeDirectory, 'ru.json'), 'utf8')));
  expect([...new Set(Object.keys(ru).map(baseKey))].sort())
    .toEqual([...new Set(Object.keys(en).map(baseKey))].sort());
  for (const [key, value] of [...Object.entries(en), ...Object.entries(ru)]) {
    expect({ key, nonempty: value.trim().length > 0, }).toEqual({ key, nonempty: true, });
  }
  for (const [key, value] of Object.entries(ru)) {
    const english = en[key] ?? en[`${baseKey(key)}_other`];
    expect({ key, variables: placeholders(value), })
      .toEqual({ key, variables: placeholders(english), });
  }
});

test.each([
  [1, '1 урок'], [2, '2 урока'], [5, '5 уроков'], [21, '21 урок']
])('Russian lesson counts use the correct form for %i', (count, expected) => {
  const i18n = createAppI18n('ru');
  expect(i18n.t('lesson-count', { count, })).toBe(expected);
});
