export default class InvalIdIdError extends Error {

  id: string | undefined;

  constructor(id: string | undefined) {
    super('id: ' + id ? id : 'undefined' + ' is invalid');
  }
}
