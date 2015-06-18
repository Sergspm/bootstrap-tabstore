# Bootstrap TabStore component

Allows you to save all or selected tabs state and restore it.

## Features

- Add some tabs to preserving list
- Restore status of this tabs
- Enable/disable preserve (only restore)

## How to get it

### Bower

```
bower install bootstrap.tabstore
```

## Reporting issues

Please provide jsFiddle when creating issues!

It's really saves much time.

Your feedback is very appreciated!

## Usage

### Basic example
Simply add `data-action="store"` to start preserving tab status.

```html
<a href="#tab-my-pets" data-toggle="tab" data-action="store">My pets</a>
```

### Manual init

You can set list of tabs or container to find tabs into

```javascript
$('.my-tabs-outer').bootstrapTabRestore();
```

Or init all tabs in page

```javascript
$('body').bootstrapTabRestore();
```

Or

```javascript
$.bootstrapTabRestore();
```

Also you can only restore status of some tabs, but not preserve status change^

```javascript
$.bootstrapTabRestore({
    track: false
});
```

### Options
Options can be passed only in JavaScript. For now..

Name|Type|Default|Description|
---|---|---|---
key|string|"bootstrap-tabs-restore-key"|Key of the storage variable
selector|string|"a[data-toggle='tab']"|Selector to filter tabs
storage|string|"localStorage"|Type of storage
track|boolean|*true*|Enable or disable tracking process (if disable, tabs restored, but not preserved)
debug|boolean|*false*|Enable or disable debug mode

### Methods
Name|Description|
---|---
on|Track on
off|Track off
restore|Force restore tabs

### Events
Name|Description|
---|---
hidden.bs.tabstore|Fired after saving status hidden tab
shown.bs.tabstore|Fired after saving status shown tab