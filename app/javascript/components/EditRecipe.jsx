import React from "react";
import { Link } from "react-router-dom";

class EditRecipe extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: "",
            name: "",
            ingredients: "",
            instruction: ""
        };
        this.initialState = {
            id: "",
            name: "",
            ingredients: "",
            instruction: ""
        };
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onReset = this.onReset.bind(this);
        this.stripHtmlEntities = this.stripHtmlEntities.bind(this);
        this.addHtmlEntities = this.addHtmlEntities.bind(this);
        this.fetchData = this.fetchData.bind(this);
    }

    fetchData(id) {
        const url = `/api/v1/show/${id}`;

        fetch(url)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error("Network response was not ok.");
            })
            .then(response => this.setState({
                id: response.id,
                name: response.name,
                ingredients: response.ingredients,
                instruction: response.instruction
            }))
            .catch(() => this.props.history.push("/recipes"));
    }

    componentDidMount() {
        const {
            match: {
                params: { id }
            }
        } = this.props;
        this.fetchData(id)
    }

    addHtmlEntities(str) {
        return String(str)
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">");
    }

    stripHtmlEntities(str) {
        return String(str)
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    }

    onChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    onSubmit(event) {
        event.preventDefault();
        const {id, name, ingredients, instruction } = this.state
        const url = `/api/v1/update/${id}`;

        const body = {
            id: id,
            name: name,
            ingredients: ingredients,
            instruction: instruction.replace(/\n/g, "<br> <br>")
        };

        const token = document.querySelector('meta[name="csrf-token"]').content;
        fetch(url, {
            method: "PATCH",
            headers: {
                "X-CSRF-Token": token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error("Network response was not ok.");
            })
            .then(response => this.props.history.push(`/recipe/${response.id}`))
            .catch(error => console.log(error.message));
    }

    onReset() {
        const id = this.state.id
        this.fetchData(id)
    }

    render() {
        // TODO: Handle replacing <br> <br> with \n when a user edits instruction
        const { id, name, ingredients, instruction } = this.state;
        return (
            <div className="container mt-5">
                <div className="row">
                    <div className="col-sm-12 col-lg-6 offset-lg-3">
                        <h1 className="font-weight-normal mb-5">
                            Update your recipe!
                        </h1>
                        <form onSubmit={this.onSubmit}>
                            <div className="form-group">
                                <label htmlFor="recipeName">Recipe name</label>
                                <input
                                    type="text"
                                    name="name"
                                    id="recipeName"
                                    className="form-control"
                                    required
                                    defaultValue={name}
                                    onChange={this.onChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="recipeIngredients">Ingredients</label>
                                <input
                                    type="text"
                                    name="ingredients"
                                    id="recipeIngredients"
                                    className="form-control"
                                    required
                                    defaultValue={ingredients}
                                    onChange={this.onChange}
                                />
                                <small id="ingredientsHelp" className="form-text text-muted">
                                    Separate each ingredient with a comma.
                                </small>
                            </div>
                            <label htmlFor="instruction">Preparation Instructions</label>
                            <textarea
                                className="form-control"
                                id="instruction"
                                name="instruction"
                                rows="5"
                                required
                                defaultValue={instruction}
                                onChange={this.onChange}
                            />
                            <button type="submit" className="btn custom-button mt-3 mr-3">
                                Save
                            </button>
                            <Link to={`/recipe/${id}`} className="btn custom-button mt-3 mr-3">
                                Cancel
                            </Link>
                            <button type="reset" className="btn custom-button mt-3 mr-3" onClick={this.onReset}>
                                Reset
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default EditRecipe;