# Damage Application — dnd5e 6 compatibility fork

A compatibility update of [Zhell's Damage Application](https://github.com/krbz999/damage-application) module, based on release **11.2.0**. It targets **Foundry VTT 14** and **dnd5e 6.0.6**. This fork is independent of the original maintainer.

The module adds controls to damage and healing chat messages for applying damage, half damage, healing, and temporary HP to selected tokens. GMs can open a dialog to adjust damage types, toggle relevant damage traits, and roll saving throws before applying damage.

## Status

The code has been checked against the installed dnd5e 6.0.6 and Foundry 14 APIs. Local automated checks cover damage message data, saving throws, damage options, and the “no damage on a successful save” case. A user has also tested the fork in Foundry and reported that it works. This is a limited field report; broader compatibility has not been established.

## Install

Copy the module files into `Data/modules/damage-application/`, then restart Foundry. This fork uses the original module ID, so it replaces the original installation and cannot run alongside it.

## Source and updates

The source for this fork is at [HackANurse/damage-application-dnd5e6](https://github.com/HackANurse/damage-application-dnd5e6). This repository does not yet provide a release ZIP or an automatic update manifest. Keep `LICENSE` and `NOTICE.md` with any redistributed copy.

Run the checks with:

```sh
node --test tests/compat.test.mjs
node --check module/module.mjs
```

## Credits and license

Original code, styles, templates, and English localization: **Zhell (krbz999)**, © 2023, under the MIT License. Compatibility fork: **HackANurse**. The unmodified original license text is included in [LICENSE](LICENSE). See [NOTICE.md](NOTICE.md) for provenance and changes. This repository does not bundle Foundry or dnd5e source code or third-party artwork.

## Support this fork

You can [support HackANurse's compatibility fork on Buy Me a Coffee](https://buymeacoffee.com/andybegh). This link supports the maintenance of this independent fork; it does not represent the original author.
