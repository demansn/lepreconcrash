export class DisplayObjectStateMachine {
    constructor(owner) {
        this.owner = owner;
        this.states = {};
        this.current = null;
    }

    add(name, state) {
        this.states[name] = state;
    }

    goTo(name) {
        if (this.current && this.states[this.current].onExit) {
            this.states[this.current].onExit.apply(this.owner);
        }

        this.current = name;

        if (typeof this.states[name] === 'function') {
            this.states[name].apply(this.owner);
        } else {
            this.states[name].onEnter.apply(this.owner);
        }
    }
}
