class UsersController < ApplicationController
  def new
    @user = User.new
  end

  def index
    users = User.all
    render json: users, except: [:created_at, :updated_at], include: :games
  end

  def show
    user = User.find(params[:id])
    render json: user, except: [:created_at, :updated_at], include: :games
  end

  def create
    if User.exists?(username: params[:username])
      user = User.where(username: params[:username]).first
      render json: user, except: [:created_at, :updated_at], include: :games
    else
      user = User.create(user_params)
      render json: user, except: [:created_at, :updated_at], include: :games
    end
  end

  private

  def user_params
    params.require(:user).permit(:username)
  end
end
