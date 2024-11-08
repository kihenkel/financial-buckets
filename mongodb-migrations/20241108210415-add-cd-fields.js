// For all "accounts" documents introduce a new field called "initialBalance" and set the value of the field "balance"

module.exports = {
  async up(db, client) {
    await db.collection('accounts')
      .updateMany({}, [{ $set: { initialBalance: '$balance' }}]);
  },

  async down(db, client) {
    await db.collection('accounts')
      .updateMany({}, { $unset: { initialBalance: '' }});
  }
};
