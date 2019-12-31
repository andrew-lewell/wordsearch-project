class UsersController < ApplicationController

    def new
        @user = User.new
    end

    def create
        @user = User.new
    end 

    private

    def user_params
        
    end 

end
