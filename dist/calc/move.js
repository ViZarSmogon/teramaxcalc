"use strict";
exports.__esModule = true;

var util_1 = require("./util");
var SPECIAL = ['Fire', 'Water', 'Grass', 'Electric', 'Ice', 'Psychic', 'Dark', 'Dragon'];
var Move = (function () {
    function Move(gen, name, options) {
        if (options === void 0) { options = {}; }
        var _a, _b;
        name = options.name || name;
        this.originalName = name;
        var data = (0, util_1.extend)(true, { name: name }, gen.moves.get((0, util_1.toID)(name)), options.overrides);
        this.hits = 1;
        if (options.useMax && data.maxMove) {
            var maxMoveName_1 = getMaxMoveName(data.type, data.name, options.species, !!(data.category === 'Status'), options.ability);
            var maxMove_1 = gen.moves.get((0, util_1.toID)(maxMoveName_1));
            var maxPower = function () {
                if (maxMove_1.basePower === 10 || maxMoveName_1 === 'Max Flare') {
                    return data.maxMove.basePower;
                }
                return maxMove_1.basePower;
            };
            data = (0, util_1.extend)(true, {}, maxMove_1, {
                name: maxMoveName_1,
                basePower: maxPower(),
                category: data.category
            });
        }
        if (options.useZ && ((_a = data.zMove) === null || _a === void 0 ? void 0 : _a.basePower)) {
            var zMoveName = getZMoveName(data.name, data.type, options.item);
            var zMove = gen.moves.get((0, util_1.toID)(zMoveName));
            data = (0, util_1.extend)(true, {}, zMove, {
                name: zMoveName,
                basePower: zMove.basePower === 1 ? data.zMove.basePower : zMove.basePower,
                category: data.category
            });
        }
        else {
            if (data.multihit) {
                if (data.multiaccuracy && typeof data.multihit === 'number') {
                    this.hits = options.hits || data.multihit;
                }
                else {
                    if (typeof data.multihit === 'number') {
                        this.hits = data.multihit;
                    }
                    else if (options.hits) {
                        this.hits = options.hits;
                    }
                    else {
                        this.hits = (options.ability === 'Skill Link')
                            ? data.multihit[1]
                            : data.multihit[0] + 1;
                    }
                }
            }
            this.timesUsedWithMetronome = options.timesUsedWithMetronome;
        }
        this.gen = gen;
        this.name = data.name;
        this.ability = options.ability;
        this.item = options.item;
        this.useZ = options.useZ;
        this.useMax = options.useMax;
        this.overrides = options.overrides;
        this.species = options.species;
        this.bp = data.basePower;
        var typelessDamage = (gen.num >= 2 && data.id === 'struggle') ||
            (gen.num <= 4 && ['futuresight', 'doomdesire'].includes(data.id));
        this.type = typelessDamage ? '???' : data.type;
        this.category = data.category ||
            (gen.num < 4 ? (SPECIAL.includes(data.type) ? 'Special' : 'Physical') : 'Status');
        var stat = this.category === 'Special' ? 'spa' : 'atk';
        if (((_b = data.self) === null || _b === void 0 ? void 0 : _b.boosts) && data.self.boosts[stat] && data.self.boosts[stat] < 0) {
            this.dropsStats = Math.abs(data.self.boosts[stat]);
        }
        this.timesUsed = options.timesUsed || 1;
        this.secondaries = data.secondaries;
        this.target = data.target || 'any';
        this.recoil = data.recoil;
        this.hasCrashDamage = !!data.hasCrashDamage;
        this.mindBlownRecoil = !!data.mindBlownRecoil;
        this.struggleRecoil = !!data.struggleRecoil;
        this.isCrit = !!options.isCrit || !!data.willCrit ||
            gen.num === 1 && ['crabhammer', 'razorleaf', 'slash', 'karate chop'].includes(data.id);
        this.isStellarFirstUse = !!options.isStellarFirstUse;
        this.drain = data.drain;
        this.flags = data.flags;
        this.priority = data.priority || 0;
        this.ignoreDefensive = !!data.ignoreDefensive;
        this.overrideOffensiveStat = data.overrideOffensiveStat;
        this.overrideDefensiveStat = data.overrideDefensiveStat;
        this.overrideOffensivePokemon = data.overrideOffensivePokemon;
        this.overrideDefensivePokemon = data.overrideDefensivePokemon;
        this.breaksProtect = !!data.breaksProtect;
        this.isZ = !!data.isZ;
        this.isMax = !!data.isMax;
        this.multiaccuracy = !!data.multiaccuracy;
        if (!this.bp) {
            if (['return', 'frustration', 'pikapapow', 'veeveevolley'].includes(data.id)) {
                this.bp = 102;
            }
        }
    }
    Move.prototype.named = function () {
        var names = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            names[_i] = arguments[_i];
        }
        return names.includes(this.name);
    };
    Move.prototype.hasType = function () {
        var types = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            types[_i] = arguments[_i];
        }
        return types.includes(this.type);
    };
    Move.prototype.clone = function () {
        return new Move(this.gen, this.originalName, {
            ability: this.ability,
            item: this.item,
            species: this.species,
            useZ: this.useZ,
            useMax: this.useMax,
            isCrit: this.isCrit,
            isStellarFirstUse: this.isStellarFirstUse,
            hits: this.hits,
            timesUsed: this.timesUsed,
            timesUsedWithMetronome: this.timesUsedWithMetronome,
            overrides: this.overrides
        });
    };
    return Move;
}());
exports.Move = Move;
function getZMoveName(moveName, moveType, item) {
    item = item || '';
    if (moveName.includes('Hidden Power'))
        return 'Breakneck Blitz';
    if (moveName === 'Clanging Scales' && item === 'Kommonium Z')
        return 'Clangorous Soulblaze';
    if (moveName === 'Darkest Lariat' && item === 'Incinium Z')
        return 'Malicious Moonsault';
    if (moveName === 'Giga Impact' && item === 'Snorlium Z')
        return 'Pulverizing Pancake';
    if (moveName === 'Moongeist Beam' && item === 'Lunalium Z')
        return 'Menacing Moonraze Maelstrom';
    if (moveName === 'Photon Geyser' && item === 'Ultranecrozium Z') {
        return 'Light That Burns the Sky';
    }
    if (moveName === 'Play Rough' && item === 'Mimikium Z')
        return 'Let\'s Snuggle Forever';
    if (moveName === 'Psychic' && item === 'Mewnium Z')
        return 'Genesis Supernova';
    if (moveName === 'Sparkling Aria' && item === 'Primarium Z')
        return 'Oceanic Operetta';
    if (moveName === 'Spectral Thief' && item === 'Marshadium Z') {
        return 'Soul-Stealing 7-Star Strike';
    }
    if (moveName === 'Spirit Shackle' && item === 'Decidium Z')
        return 'Sinister Arrow Raid';
    if (moveName === 'Stone Edge' && item === 'Lycanium Z')
        return 'Splintered Stormshards';
    if (moveName === 'Sunsteel Strike' && item === 'Solganium Z')
        return 'Searing Sunraze Smash';
    if (moveName === 'Volt Tackle' && item === 'Pikanium Z')
        return 'Catastropika';
    if (moveName === 'Nature\'s Madness' && item === 'Tapunium Z')
        return 'Guardian of Alola';
    if (moveName === 'Thunderbolt') {
        if (item === 'Aloraichium Z')
            return 'Stoked Sparksurfer';
        if (item === 'Pikashunium Z')
            return '10,000,000 Volt Thunderbolt';
    }
    return ZMOVES_TYPING[moveType];
}
exports.getZMoveName = getZMoveName;
var ZMOVES_TYPING = {
    Bug: 'Savage Spin-Out',
    Dark: 'Black Hole Eclipse',
    Dragon: 'Devastating Drake',
    Electric: 'Gigavolt Havoc',
    Fairy: 'Twinkle Tackle',
    Fighting: 'All-Out Pummeling',
    Fire: 'Inferno Overdrive',
    Flying: 'Supersonic Skystrike',
    Ghost: 'Never-Ending Nightmare',
    Grass: 'Bloom Doom',
    Ground: 'Tectonic Rage',
    Ice: 'Subzero Slammer',
    Normal: 'Breakneck Blitz',
    Poison: 'Acid Downpour',
    Psychic: 'Shattered Psyche',
    Rock: 'Continental Crush',
    Steel: 'Corkscrew Crash',
    Water: 'Hydro Vortex'
};
function getMaxMoveName(moveType, moveName, pokemonSpecies, isStatus, pokemonAbility) {
    if (isStatus)
        return 'Max Guard';
    if (pokemonAbility === 'Normalize')
        return 'Max Strike';
    if (moveType === 'Normal' && !(moveName === 'Weather Ball' || moveName === 'Terrain Pulse')) {
        if (pokemonAbility === 'Pixilate')
            return 'Max Starfall';
        if (pokemonAbility === 'Aerilate')
            return 'Max Airstream';
        if (pokemonAbility === 'Refrigerate')
            return 'Max Hailstorm';
        if (pokemonAbility === 'Galvanize')
            return 'Max Lightning';
    }
    if (moveName === 'Frenzy Plant' && pokemonSpecies === 'Venusaur-Gmax')
        return 'G-Max Vine Lash';
    if (moveName === 'Blast Burn' && pokemonSpecies === 'Charizard-Gmax')
        return 'G-Max Wildfire';
    if (moveName === 'Hydro Cannon' && pokemonSpecies === 'Blastoise-Gmax')
        return 'G-Max Cannonade';
    if (moveName === 'Pollen Puff' && pokemonSpecies === 'Butterfree-Gmax')
        return 'G-Max Befuddle';
    if (moveName === 'Volt Tackle' && pokemonSpecies === 'Pikachu-Gmax')
        return 'G-Max Volt Crash';
    if (moveName === 'Pay Day' && pokemonSpecies === 'Meowth-Gmax')
        return 'G-Max Gold Rush';
    if (moveName === 'Dynamic Punch' && pokemonSpecies === 'Machamp-Gmax')
        return 'G-Max Chi Strike';
    if (moveName === 'Shadow Ball' && pokemonSpecies === 'Gengar-Gmax')
        return 'G-Max Terror';
    if (moveName === 'Crabhammer' && pokemonSpecies === 'Kingler-Gmax')
        return 'G-Max Foam Burst';
    if (moveName === 'Freeze-Dry' && pokemonSpecies === 'Lapras-Gmax')
        return 'G-Max Resonance';
    if (moveName === 'Last Resort' && pokemonSpecies === 'Eevee-Gmax')
        return 'G-Max Cuddle';
    if (moveName === 'Body Slam' && pokemonSpecies === 'Snorlax-Gmax')
        return 'G-Max Replenish';
    if (moveName === 'Gunk Shot' && pokemonSpecies === 'Garbodor-Gmax')
        return 'G-Max Malodor';
    if (moveName === 'Double Iron Bash' && pokemonSpecies === 'Melmetal-Gmax')
        return 'G-Max Meltdown';
    if (moveName === 'Drum Beating' && pokemonSpecies === 'Rillaboom-Gmax')
        return 'G-Max Drum Solo';
    if (moveName === 'Pyro Ball' && pokemonSpecies === 'Cinderace-Gmax')
        return 'G-Max Fireball';
    if (moveName === 'Snipe Shot' && pokemonSpecies === 'Inteleon-Gmax')
        return 'G-Max Hydrosnipe';
    if (moveName === 'Brave Bird' && pokemonSpecies === 'Corviknight-Gmax')
        return 'G-Max Wind Rage';
    if (moveName === 'Psychic' && pokemonSpecies === 'Orbeetle-Gmax')
        return 'G-Max Gravitas';
    if (moveName === 'Razor Shell' && pokemonSpecies === 'Drednaw-Gmax')
        return 'G-Max Stonesurge';
    if (moveName === 'Tar Shot' && pokemonSpecies === 'Coalossal-Gmax')
        return 'G-Max Volcalith';
    if (moveName === 'Grav Apple' && pokemonSpecies === 'Flapple-Gmax')
        return 'G-Max Tartness';
    if (moveName === 'Apple Acid' && pokemonSpecies === 'Appletun-Gmax')
        return 'G-Max Sweetness';
    if (moveName === 'Sand Tomb' && pokemonSpecies === 'Sandaconda-Gmax')
        return 'G-Max Sandblast';
    if (moveName === 'Fire Lash' && pokemonSpecies === 'Centiskorch-Gmax')
        return 'G-Max Centiferno';
    if (moveName === 'Overdrive' && (pokemonSpecies === null || pokemonSpecies === void 0 ? void 0 : pokemonSpecies.startsWith('Toxtricity')) && (pokemonSpecies === null || pokemonSpecies === void 0 ? void 0 : pokemonSpecies.endsWith('Gmax')))
        return 'G-Max Stun Shock';
    if (moveName === 'Dazzling Gleam' && pokemonSpecies === 'Hatterene-Gmax')
        return 'G-Max Smite';
    if (moveName === 'False Surrender' && pokemonSpecies === 'Grimmsnarl-Gmax')
        return 'G-Max Snooze';
    if (moveName === 'Draining Kiss' && pokemonSpecies === 'Alcremie-Gmax')
        return 'G-Max Finale';
    if (moveName === 'Heavy Slam' && pokemonSpecies === 'Copperajah-Gmax')
        return 'G-Max Steelsurge';
    if (moveName === 'Draco Meteor' && pokemonSpecies === 'Duraludon-Gmax')
        return 'G-Max Depletion';
    if (moveName === 'Wicked Blow' && pokemonSpecies === 'Urshifu-Gmax')
        return 'G-Max One Blow';
    if (moveName === 'Surging Strikes' && pokemonSpecies === 'Urshifu-Rapid-Strike-Gmax')
        return 'G-Max Rapid Flow';
    return 'Max ' + MAXMOVES_TYPING[moveType];
}
exports.getMaxMoveName = getMaxMoveName;
var MAXMOVES_TYPING = {
    Bug: 'Flutterby',
    Dark: 'Darkness',
    Dragon: 'Wyrmwind',
    Electric: 'Lightning',
    Fairy: 'Starfall',
    Fighting: 'Knuckle',
    Fire: 'Flare',
    Flying: 'Airstream',
    Ghost: 'Phantasm',
    Grass: 'Overgrowth',
    Ground: 'Quake',
    Ice: 'Hailstorm',
    Normal: 'Strike',
    Poison: 'Ooze',
    Psychic: 'Mindstorm',
    Rock: 'Rockfall',
    Steel: 'Steelspike',
    Water: 'Geyser'
};
//# sourceMappingURL=move.js.map