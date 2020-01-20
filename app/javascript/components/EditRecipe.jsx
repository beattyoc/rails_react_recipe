import React from "react";
import { Link } from "react-router-dom";
import ImageUploader from "react-images-upload";

class EditRecipe extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: "",
            name: "",
            ingredients: "",
            instruction: "",
            pictures: [],
            initialName: "",
            initialIngredients: "",
            initialInstruction: "",
            initialPictures: []
        };
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onReset = this.onReset.bind(this);
        this.stripHtmlEntities = this.stripHtmlEntities.bind(this);
        this.addHtmlEntities = this.addHtmlEntities.bind(this);
        this.fetchData = this.fetchData.bind(this);
        this.onDrop = this.onDrop.bind(this);
    }

    onDrop(picture) {
        var reader = new FileReader();
        reader.readAsDataURL(picture[0]);
        reader.onload = () => {
            this.setState(
                {pictures: this.state.pictures.concat({"name": picture[0].name,"base64_string": reader.result})}
            );
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
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
                instruction: response.instruction.replace(/<br> <br>/g, "\n"),
                initialName: response.name,
                initialIngredients: response.ingredients,
                initialInstruction: response.instruction.replace(/<br> <br>/g, "\n")
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
        const {id, name, ingredients, instruction, pictures } = this.state
        const url = `/api/v1/update/${id}`;
        const token = document.querySelector('meta[name="csrf-token"]').content;

        const body = {
            id: id,
            name: name,
            ingredients: ingredients,
            instruction: instruction.replace(/\n/g, "<br> <br>"),
            pictures: pictures
        };

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
        this.setState({
            name: this.state.initialName,
            ingredients: this.state.initialIngredients,
            instruction: this.state.initialInstruction,
            pictures: this.state.initialPictures
        });
    }

    render() {
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
                            <ImageUploader
                                withIcon={true}
                                buttonText='Choose images'
                                onChange={this.onDrop}
                                imgExtension={['.jpg', '.gif', '.png', '.gif']}
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