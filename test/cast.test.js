import { assert } from 'chai'
import bsv from 'bsv'
import Cast from '../src/cast'

const casting = {
  template: [ bsv.OpCode.OP_RETURN, { size: 10 }, { size: _ => 10 } ],
  script(_) { return new bsv.Script() }
}


describe('new Cast()', () => {
  let cast1, cast2;
  beforeEach(() => {
    cast1 = new Cast()
    cast2 = new Cast(casting)
  })

  it('size() returns 1 when blank cast', () => {
    assert.equal(cast1.size(), 1)
  })

  it('size() calculates size when template given', () => {
    assert.equal(cast2.size(), 24)
  })

  it('script() throws error when blank cast', () => {
    assert.throws(_ => cast1.script(), 'Cast created with no script() function')
  })

  it('script() returns a value when callback given', () => {
    assert.instanceOf(cast2.script(), bsv.Script)
  })
})


describe('Cast.lockingScript()', () => {
  it('throws error if satoshis not given', () => {
    assert.throws(_ => {
      Cast.lockingScript({ lockingScript: casting })
    }, "Cast type 'lockingScript' requires 'satoshis' param")
  })

  it('other given params stored on params object', () => {
    const cast = Cast.lockingScript({ lockingScript: casting }, { satoshis: 5000, foo: 'bar' })
    assert.deepEqual(cast.params, { foo: 'bar' })
  })
})


describe('Cast.lockingScript()', () => {
  const castMod = { lockingScript: casting }

  it('throws error if satoshis not given', () => {
    assert.throws(_ => {
      Cast.lockingScript(castMod)
    }, "Cast type 'lockingScript' requires 'satoshis' param")
  })

  it('other given params stored on params object', () => {
    const cast = Cast.lockingScript(castMod, { satoshis: 5000, foo: 'bar' })
    assert.deepEqual(cast.params, { foo: 'bar' })
  })
})


describe('Cast.unlockingScript()', () => {
  const castMod = { unlockingScript: casting }

  it('throws error if required params not given', () => {
    assert.throws(_ => {
      Cast.unlockingScript(castMod)
    }, "Cast type 'unlockingScript' requires 'txid' param")
    assert.throws(_ => {
      Cast.unlockingScript(castMod, { txid: '0000' })
    }, "Cast type 'unlockingScript' requires 'script' param")
    assert.throws(_ => {
      Cast.unlockingScript(castMod, { txid: '0000', script: '0000' })
    }, "Cast type 'unlockingScript' requires 'satoshis' param")
    assert.throws(_ => {
      Cast.unlockingScript(castMod, { txid: '0000', script: '0000', satoshis: 5000 })
    }, "Cast type 'unlockingScript' requires 'vout' param")
    assert.doesNotThrow(_ => {
      Cast.unlockingScript(castMod, { txid: '0000', script: '0000', satoshis: 5000, vout: 0 })
    })
  })

  it('accepts either satoshis or amount param', () => {
    const c1 = Cast.unlockingScript(castMod, { txid: '0000', script: '0000', satoshis: 5000, vout: 0 })
    const c2 = Cast.unlockingScript(castMod, { txid: '0000', script: '0000', amount: 5000, vout: 0 })
    assert.equal(c1.txOut.valueBn.toNumber(), 5000)
    assert.equal(c2.txOut.valueBn.toNumber(), 5000)
  })

  it('accepts either vout or outputIndex or txOutNum param', () => {
    const c1 = Cast.unlockingScript(castMod, { txid: '0000', script: '0000', satoshis: 5000, vout: 0 })
    const c2 = Cast.unlockingScript(castMod, { txid: '0000', script: '0000', satoshis: 5000, outputIndex: 0 })
    const c3 = Cast.unlockingScript(castMod, { txid: '0000', script: '0000', satoshis: 5000, txOutNum: 0 })
    assert.equal(c1.txOutNum, 0)
    assert.equal(c2.txOutNum, 0)
    assert.equal(c3.txOutNum, 0)
  })

  it('other given params stored on params object', () => {
    const cast = Cast.unlockingScript(castMod, { txid: '0000', script: '0000', satoshis: 5000, vout: 0, foo: 'bar' })
    assert.deepEqual(cast.params, { foo: 'bar' })
  })
})