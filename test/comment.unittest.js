const { expect } = require("chai");
const { validateComment } = require("../models/comment");

describe('validateComment', () => {
  it('valid model does not throw error', async () => {
    var comment = {
      userId: { id: 'bcd56789012345678901234', _bsontype: 'ObjectId' },
      body: 'some sample string'
    };
    
    expect(() => validateComment(comment)).to.not.throw();
  });

  it('valid model response correct', async () => {
    var comment = {
      userId: { id: 'bcd56789012345678901234', _bsontype: 'ObjectId' },
      body: 'some sample string'
    };
    
    var response = validateComment(comment);
    expect(response.value.userId._bsontype).to.equal('ObjectId');
    expect(response.value.userId.id).to.equal('bcd56789012345678901234');
    expect(response.value.body).to.equal('some sample string');
  });

  it('userId required', async () => {
    var comment = {
      body: 'some sample string'
    };

    var response = validateComment(comment);
    expect(response.error.details[0]).to.exist;
    expect(response.error.details[0].message).to.include('userId');
  });

  it('body required', async () => {
    var comment = {
      userId: { id: 'bcd56789012345678901234', _bsontype: 'ObjectId' }
    };

    var response = validateComment(comment);
    expect(response.error.details[0]).to.exist;
    expect(response.error.details[0].message).to.include('body');
  });

  it('body empty', async () => {
    var comment = {
      userId: { id: 'bcd56789012345678901234', _bsontype: 'ObjectId' },
      body: ''
    };

    var response = validateComment(comment);
    expect(response.error.details[0]).to.exist;
    expect(response.error.details[0].message).to.include('body');
    expect(response.error.details[0].message).to.include('empty');
  });

  it('body maximum exceeded', async () => {
    var comment = {
      userId: { id: 'bcd56789012345678901234', _bsontype: 'ObjectId' },
      body: '6537724785845225597979468638969786233726632753727858625882792723466479433325495498367777274266585223625588467886673243765628685342534283248455985395238995837665687462937422384352266345468268458598993833556459244639272662825983864468677669678639887622383893'
    };

    var response = validateComment(comment);
    expect(response.error.details[0]).to.exist;
    expect(response.error.details[0].message).to.include('body');
    expect(response.error.details[0].message).to.include('255');
  });
});
