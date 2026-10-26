import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../module/module.mjs', import.meta.url), 'utf8');
const context = vm.createContext({
  FormApplication: class {},
  dnd5e: {applications: {DialogMixin: Base => Base}, dice: {
    aggregateDamageRolls: rolls => rolls
  }},
  Hooks: {once() {}},
  CONFIG: {DND5E: {itemProperties: {mgc: {isPhysical: true}}}, Dice: {D20Roll: {determineAdvantageMode: () => ({isFF: true})}}},
  fromUuid: async () => {throw Error('Legacy item lookup used');},
  game: {user: {isGM: true}},
  canvas: {}
});
const DamageApplicator = vm.runInContext(`${source}\nDamageApplicator`, context);

const message = {
  type: 'damage',
  rolls: [
    {total: 7, options: {type: 'fire', properties: ['mgc']}},
    {total: 3, options: {type: 'cold', properties: []}}
  ],
  system: {
    targets: [{token: 'Scene.s.Token.t'}],
    onSave: 'half',
    activity: {uuid: 'Activity.a'}
  },
  getAssociatedItem: () => ({type: 'spell', system: {level: 3}}),
  getAssociatedActivity: () => ({save: {ability: new Set(['dex']), dc: {value: 14}}})
};
const data = await DamageApplicator.retrieveMessageData(message);
assert.equal(data.values.fire, 7);
assert.equal(data.values.cold, 3);
assert.equal(data.hasSave, true);
assert.equal(data.saveData.ability, 'dex');
assert.equal(data.saveData.dc, 14);
assert.deepEqual(Array.from(data.properties), ['mgc']);

let saveConfig;
const actor = {
  system: {attributes: {hp: {value: 10, temp: 0}}},
  getActiveTokens: () => [],
  rollSavingThrow: async config => {
    saveConfig = config;
    return [{total: 16}];
  }
};
assert.equal(await DamageApplicator.rollAbilitySave(actor, 'dex', 14), true);
assert.equal(saveConfig.ability, 'dex');

let application;
const target = {system: {attributes: {hp: {value: 10, temp: 0}}}};
target.applyDamage = async (damages, options) => { application = {damages, options}; };
await DamageApplicator.applyDamageToActor(target, {fire: 7}, new Set(['mgc']), 0.5,
  {resistance: new Set(['fire'])});
assert.equal(application.damages[0].type, 'fire');
assert.equal(application.damages[0].value, 7);
assert.equal(application.options.multiplier, 0.5);
assert.equal(application.options.ignore.resistance.has('fire'), true);

DamageApplicator._getDataFromDamageRoll = async () => ({
  properties: new Set(), values: {fire: 7}, onSave: 'none', saveData: {ability: 'dex', dc: 14}
});
DamageApplicator._getActors = () => new Set([actor]);
let applied = false;
DamageApplicator.applyDamageToActor = async () => { applied = true; };
await DamageApplicator._quickSaveAndApply({});
assert.equal(applied, false, 'no damage on successful save when onSave is none');

console.log('compatibility tests passed');
