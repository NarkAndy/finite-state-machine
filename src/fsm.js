class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
		if (!config) {
			throw new Error();
		}

		this.config = config;
		this.curState = config.initial;
		this._undo = []
		this._redo = [];
	}

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
		return this.curState;
	}

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
		if (this.config.states[state]) {
            this._undo.unshift(this.curState);
            this._redo.length = 0;
            this.curState = state;
        }
        else {
            throw new Error();
        }
	}

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
		if (this.config.states[this.curState].transitions[event]) {
            this._redo.length = 0;
            this.changeState(this.config.states[this.curState].transitions[event]);
        }
        else {
            throw new Error();
        }
	}

    /**
     * Resets FSM state to initial.
     */
    reset() {
		this.curState=this.config.initial;
	}

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
		let states = [];
		if (!event) {
			for(let state in this.config.states){
				states.push(state);
			}
			return states;
		}

		else {
			for(let state in this.config.states){
				if(event in this.config.states[state].transitions)
					states.push(state);
			}
			return states;
		}
	}

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
		if (this._undo.length) {
            this._redo.unshift(this.curState);
            this.curState = this._undo.shift();
            return true;
        }
        else {
            return false;
        }
	}

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
		 if (this._redo.length) {
            this._undo.unshift(this.curState);
            this.curState=this._redo.shift();
            return true;
        }
        else {
            return false;
        }
	}

    /**
     * Clears transition history
     */
    clearHistory() {
		this._redo.length = 0;
		this._undo.length = 0;
	}
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
