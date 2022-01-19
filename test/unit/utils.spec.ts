import test from 'ava'
import { PABoolean, PAString, PATag, PAU32 } from '../../src/tag'
import { createIterator } from '../../src/utils/iterator'
import { JSONParse, JSONStringify } from '../../src/utils/bigInt'

const tags: Array<PATag<any>> = [
  new PABoolean(true),
  new PAU32(1),
  new PAString('1')
]

const objectWithBigInt = {
  a: BigInt(9007199254740991),
  b: 1234
}

const stringifiedObjectWithBigInt = '{"a":"9007199254740991n","b":1234}'

test('Iterate and extract values', t => {
  const iterableTags = createIterator(tags)
  t.is(iterableTags.nextValue().value, true)
  t.is(iterableTags.nextValue().value, 1)
  t.is(iterableTags.nextValue().value, '1')
})

test('Throw error if iterating past max elements', t => {
  const iterableTags = createIterator(tags)
  t.is(iterableTags.nextValue().value, true)
  t.is(iterableTags.nextValue().value, 1)
  t.is(iterableTags.nextValue().value, '1')
  t.throws(() => {
    console.log(iterableTags.nextValue().value)
  })
})

test('JSONStringify', t => {
  t.deepEqual(JSONStringify(objectWithBigInt), stringifiedObjectWithBigInt)
})

test('JSONParse', t => {
  t.deepEqual(JSONParse(stringifiedObjectWithBigInt), objectWithBigInt)
})
