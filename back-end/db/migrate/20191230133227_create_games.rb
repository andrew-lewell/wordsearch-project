class CreateGames < ActiveRecord::Migration[6.0]
  def change
    create_table :games do |t|
      t.references :user, null: false, foreign_key: true
      t.string :difficulty
      t.integer :score
      t.timestamps
    end
  end
end
