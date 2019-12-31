class GamesController < ApplicationController

  def index 
    games = Game.all 
    render json: games, except: [:created_at, :updated_at]
  end 

  def show
    game = Game.find(params[:id])
    render json: game, except: [:created_at, :updated_at]
  end
    
  def create
    game = Game.new(game_params)
    if game.save 
      render json: game, except: [:created_at, :updated_at]
    else 
      render json: {error: 'Game could not be saved'}
    end
  end 
    
  private 
    
  def game_params
    params.require(:difficulty, :score)
  end 

end
