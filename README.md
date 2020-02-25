# Fluent-GWT #

Fluent-GWT is the answer to limiting the amount of build tooling needed in order to get well-structured tests created with a Given/When/Then or Arrange/Act/Assert style format.

Though Jasmine-Given, Mocha-Given, and Mocha-GWT exist, they all require, at the very least, a coffeescript compiler added into the toolchain.  This makes them hard to integrate into current testing solutions and unfriendly if users are already feeling tooling fatigue.

## Setup ##

Install with npm:

```npm install fluent-gwt --save-dev```

## Usage ##

Fluent-GWT can be used by requiring it into your test file (node) or adding it to your test runner and interfacing directly from the browser (client). Below is an example of a test 