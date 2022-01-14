import * as path from 'path'
import * as fs from 'fs'

export interface Dictionary<T> {
  [key: string]: T
}

export type Fixture = Dictionary<any>

export async function loadFixture (name: string): Promise<Fixture> {
  const directory = path.resolve(__dirname, '../fixtures', name)
  const files = await fs.promises.readdir(directory)

  const fixture: Fixture = {}
  for (const file of files) {
    const filePath = path.join(directory, file)
    const extension = path.extname(file)
    const filename = path.basename(file, extension)

    switch (extension) {
      case '.json':
        fixture[filename] = await import(filePath)
        break
      default:
        throw new Error('Invalid fixture extension')
    }
  }

  return fixture
}