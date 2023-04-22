# mana-spells Data Model documentation 

This documents the various data models (flag structure) used in each of the versions of the mod. This is used to make translating/porting the data models between versions easier.

In this document we describe the data model with a tree structure outlining the various flags and the value of their type.
Additionally, for each version after the first, we also explain the differences between the last and current version.

## Alpha releases - v0.1.0

The module only uses one flag at this point, though that flag is represented with an object (SpellFlag).

### v0.1.0


```
├── flags.mana-base
│   ├── properties : SpellFlag
└──
```

**Custom Data Classes:**
 - SpellFlag
   - name : string
   - baseLvl : number
   - circles : Circle[] (from mana-circles mod)
   - custom : boolean
   - modVersion: string 
