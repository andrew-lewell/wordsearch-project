# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

u1 = User.create(username: "Andy L")
u2 = User.create(username: "Sia P")

g1 = Game.create(user_id: 1, difficulty: "Hard", score: 5000, words: "hello")
g2 = Game.create(user_id: 1, difficulty: "Medium", score: 2000, words: "hey house")
g3 = Game.create(user_id: 2, difficulty: "Easy", score: 1000, words: "")
g4 = Game.create(user_id: 2, difficulty: "Hard", score: 10, words: "")

# g1.user_id = u1.id
# g2.user_id = u1.id
# g3.user_id = u2.id
# g3.user_id = u2.id
