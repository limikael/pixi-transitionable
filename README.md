pixi-transitionable
===================

* [Demo](http://limikael.altervista.org/pixi-transitionable-demo/)
* [Reference docs](http://limikael.altervista.org/pixi-transitionable-doc/)

A Transitionable is a DisplayObject that can have different views states and transition smoothly between them.

Think of a Transitionable as a DisplayObjectContainer, in the sense that it has properties such as position, rotation and scale to control its appearance. In the case of DisplayObjectContainer you set those properties directly, but in the case of a Transitionable you set up a number of states defining the possible values for those properties. You can then transition between those states and these properties will be tweened to animate smoothly.

For example:

````javascript
var transitionable = new Transitionable();

transitionable.state("out").scale = 1;
transitionable.state("over").scale = 1.5;

transitionable.addChild(someContent);
````

This defines a transitinable that has two states, the "out" state and the "over" state. When the transitionable is in its "out" state, the scale should be 1, and when it is in its "over" state the scale is 1.5. Also, the transitionable has some content, illustrated by the addChild call, and that content could be anything that can be added to a DisplayObjectContainer. Now, to set our transitionable to the "over" state, we can simply do:

    transitionable.current = "over";

Which will cause it to smoothly scale to 1.5 its original size. To make it shrink down again, we can do:

    transitionable.current = "out";

We can control how the transition should happen by accessing a transition object and set properties there. For example, if we would like the transition from the "over" state to the "out" state to take 500 milliseconds we can do:

    transitionable.transition("out", "over").duration = 500;

For more details on how to control the properties set by the states and transitions, see the TransitionableState and TransitionableTransition classes.
