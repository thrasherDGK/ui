import Ember from 'ember';
import fetch from 'ember-network/fetch';
import config from '../config/environment';

const { inject } = Ember;

export default Ember.Route.extend({
  session: inject.service(),
  beforeModel() {
    if (!this.get('session').get('isAuthenticated')) {
      this.transitionTo('auth.login');
    }
  },

  afterModel() {
    return fetch(`${config.DS.host}/${config.DS.namespace}/user/current`, {
      type: 'GET',
      headers: {
        'Authorization': `Bearer ${this.get('session').get('session.content.authenticated.access_token')}`
      }
    }).then(raw => {
      return raw.json().then(data => {
        const currentUser = this.store.push(data);
        this.set('session.currentUser', currentUser);
      });
    });
  }
});
