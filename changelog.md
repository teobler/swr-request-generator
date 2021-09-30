# changelog

## 0.7.3

- (new feature) support nullable schema
- (minor change) remove useless `keyof typeof` keyword for enum type
  - previous: `{ someField: keyof typeof EnumType }`
  - now: `{ someField: EnumType }`
- (bug fix) fix cannot generate enum type in definition issue
