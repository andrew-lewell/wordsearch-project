class UsersController < ApplicationController
  def new
    @user = User.new
  end

  def create
    @user = User.create(user_params)
  end

  private

  def user_params
    params.require(:user).permit(:user_name)
  end
end
