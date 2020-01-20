require 'base64'
require 'tempfile'

class Api::V1::RecipesController < ApplicationController
  def index
    recipe = Recipe.all.order(created_at: :desc)
    render json: recipe
  end

  def create
    recipe = Recipe.create!(recipe_params)
    if recipe
      render json: recipe
    else
      render json: recipe.errors
    end
  end

  def show
    if recipe
      render json: recipe
    else
      render json: recipe.errors
    end
  end

  def destroy
    recipe&.destroy
    render json: { message: 'Recipe deleted!' }
  end

  def update
    params[:pictures].each do |picture_param|
      base64_string = picture_param[:base64_string]
      name = picture_param[:name]
      content_type = /data:(.*);base64,/.match(base64_string)[1]
      base64_string.slice!(/data:.*;base64,/)
      Tempfile.create(name) do |f|
        f.write(Base64.decode64(base64_string).force_encoding("UTF-8"))
        f.rewind
        recipe.pictures.attach(
          io: f,
          filename: name,
          content_type: content_type
        )
      end
    end
    if recipe.update!(recipe_params)
      render json: recipe
    else
      render json: recipe.errors
    end
  end

  private

  def recipe_params
    params.permit(:name, :ingredients, :instruction)
  end

  def recipe
    @recipe ||= Recipe.find(params[:id])
  end
end
