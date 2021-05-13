import { Component } from 'react'

class Setting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            difficulty: '',
            reward: '',
        }

        this.handleClickSave = this.handleClickSave.bind(this);
        this.handleOnchange = this.handleOnchange.bind(this);
    }

    handleClickSave() {
        console.log(this.state);
    }

    handleOnchange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        })
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-sm-2">
                    </div>
                    <div className="col-sm-8 my-5">
                        <h1 className="mb-5">Settings</h1>
                        <div className="form-group w-100">
                            <label>Difficulty</label>
                            <input type="text" name="difficulty" className="form-control" value={this.state.difficulty} onChange={this.handleOnchange} />
                        </div>
                        <div className="form-group w-100">
                            <label>Reward</label>
                            <input type="text" name="reward" className="form-control" value={this.state.reward} onChange={this.handleOnchange} />
                        </div>
                        <button onClick={this.handleClickSave} type="button" className="btn btn-primary">Save</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default Setting;