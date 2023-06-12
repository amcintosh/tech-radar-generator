const Quadrant = require('../../src/models/quadrant')
const Blip = require('../../src/models/blip')

describe('Quadrant', function () {
  it('has a name', function () {
    const quadrant = new Quadrant('My Quadrant')

    expect(quadrant.name()).toEqual('My Quadrant')
  })

  it('has no blips by default', function () {
    const quadrant = new Quadrant('My Quadrant')

    expect(quadrant.blips()).toEqual([])
  })

  it('can add a single blip', function () {
    const quadrant = new Quadrant('My Quadrant')

    quadrant.add(new Blip())

    expect(quadrant.blips().length).toEqual(1)
  })

  it('can add multiple blips', function () {
    const quadrant = new Quadrant('My Quadrant')

    quadrant.add([new Blip(), new Blip()])

    expect(quadrant.blips().length).toEqual(2)
  })
})
