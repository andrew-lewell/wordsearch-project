class UsersController < ApplicationController

  def index 
    users = User.all 
    render json: users, except: [:created_at, :updated_at], include: :games
  end 
    
  def show
    user = User.find(params[:id])
    render json: user, except: [:created_at, :updated_at], include: :games
  end
        
  def create
    user = User.new(user_params)
    if user.save 
      ender json: user, except: [:created_at, :updated_at], include: :games
    else 
      render json: {error: 'User could not be saved'}
    end
  end 
        
  private 
        
  def user_params
    params.require(:username)
  end 

end
