/*
  Copyright (c) 2008 - 2016 MongoDB, Inc. <http://mongodb.com>

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

var _ = require('lodash');
var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');
var mongoDb;
MongoClient.connect('mongodb://localhost:27017/mongomart', function(err, db) {
	if (!err) return mongoDb = db;
	console.dir(err);
});

function ItemDAO(database) {
    "use strict";

    this.db = database;

    this.getCategories = function(callback) {
        "use strict";

        /*
        * TODO-lab1A
        *
        * LAB #1A: Implement the getCategories() method.
        *
        * Write an aggregation query on the "item" collection to return the
        * total number of items in each category. The documents in the array
        * output by your aggregation should contain fields for "_id" and "num".
        *
        * HINT: Test your mongodb query in the shell first before implementing
        * it in JavaScript.
        *
        * In addition to the categories created by your aggregation query,
        * include a document for category "All" in the array of categories
        * passed to the callback. The "All" category should contain the total
        * number of items across all categories as its value for "num". The
        * most efficient way to calculate this value is to iterate through
        * the array of categories produced by your aggregation query, summing
        * counts of items in each category.
        *
        * Ensure categories are organized in alphabetical order before passing
        * to the callback.
        *
        */

        var categories = [];
        var category = {
            _id: "All",
            num: 9999
        };

	var collection = mongoDb.collection('item');
	collection.aggregate(
	{$match: { "category": {$ne:null}}},
	{$project: {_id:0, title:1, category:1}}, 
	{$group: {
		_id: "$category",
		num: { $sum: 1}
	}},
	{ $sort: { "_id": 1}}).toArray(function(err, docs) {
		docs = _.sortBy(docs, function (e) { return e._id });
		console.dir(docs);
		console.dir(err);
		categories = docs;
		var total_items = categories.reduce(function(p, c) {
			return p + c.num;
		}, 0);
		console.dir(categories);
		category.num = total_items;
		categories.unshift(category);
		callback(categories);
	});

	// TODO-lab1A Replace all code above (in this method).

        // TODO Include the following line in the appropriate
        // place within your code to pass the categories array to the
        // callback.
    }


    this.getItems = function(category, page, itemsPerPage, callback) {
        "use strict";
	console.dir('cat:' + category);
	console.dir('page:' + page);
	console.dir('items:' + itemsPerPage);

        /*
         * TODO-lab1B
         *
         * LAB #1B: Implement the getItems() method.
         *
         * Create a query on the "item" collection to select only the items
         * that should be displayed for a particular page of a given category.
         * The category is passed as a parameter to getItems().
         *
         * Use sort(), skip(), and limit() and the method parameters: page and
         * itemsPerPage to identify the appropriate products to display on each
         * page. Pass these items to the callback function.
         *
         * Sort items in ascending order based on the _id field. You must use
         * this sort to answer the final project questions correctly.
         *
         * Note: Since "All" is not listed as the category for any items,
         * you will need to query the "item" collection differently for "All"
         * than you do for other categories.
         *
         */

        var pageItem = this.createDummyItem();
        var pageItems = [];
	var collection = mongoDb.collection('item');
	category = (category !== 'All' ? {"category": category} : {});
	collection.find(category).sort({_id:1}).limit(itemsPerPage).skip(page*itemsPerPage).toArray(function(err, docs) {
		// console.dir(docs);
		if (!err) return callback(docs);
		console.dir(err);
	});
        /* for (var i=0; i<5; i++) {

            pageItems.push(pageItem);
        } */ 

        // TODO-lab1B Replace all code above (in this method).

        // TODO Include the following line in the appropriate
        // place within your code to pass the items for the selected page
        // to the callback.
    }


    this.getNumItems = function(category, callback) {
        "use strict";
        var numItems = 0;
	var collection = mongoDb.collection('item');
        category = (category !== 'All' ? {"category": category} : {});
        collection.find(category).toArray(function(err, docs) {
		console.dir(docs.length);
                if (!err) return callback(docs.length);
                console.dir(err);
        });

        /*
         * TODO-lab1C:
         *
         * LAB #1C: Implement the getNumItems method()
         *
         * Write a query that determines the number of items in a category
         * and pass the count to the callback function. The count is used in
         * the mongomart application for pagination. The category is passed
         * as a parameter to this method.
         *
         * See the route handler for the root path (i.e. "/") for an example
         * of a call to the getNumItems() method.
         *
         */

         // TODO Include the following line in the appropriate
         // place within your code to pass the count to the callback.
        // callback(numItems);
    }


    this.searchItems = function(query, page, itemsPerPage, callback) {
        "use strict";

        /*
         * TODO-lab2A
         *
         * LAB #2A: Implement searchItems()
         *
         * Using the value of the query parameter passed to searchItems(),
         * perform a text search against the "item" collection.
         *
         * Sort the results in ascending order based on the _id field.
         *
         * Select only the items that should be displayed for a particular
         * page. For example, on the first page, only the first itemsPerPage
         * matching the query should be displayed.
         *
         * Use limit() and skip() and the method parameters: page and
         * itemsPerPage to select the appropriate matching products. Pass these
         * items to the callback function.
         *
         * searchItems() depends on a text index. Before implementing
         * this method, create a SINGLE text index on title, slogan, and
         * description. You should simply do this in the mongo shell.
         *
         */

        var item = this.createDummyItem();
        var items = [];
        var collection = mongoDb.collection('item');
        collection.find({'$text':{'$search':query}}).sort({_id:1}).limit(itemsPerPage).skip(page*itemsPerPage).toArray(
function(err, docs) {
                console.dir(docs);
                if (!err) return callback(docs);
                console.dir(err);
        });
        /* for (var i=0; i<5; i++) {
            items.push(item);
        } */

        // TODO-lab2A Replace all code above (in this method).

        // TODO Include the following line in the appropriate
        // place within your code to pass the items for the selected page
        // of search results to the callback.
        // callback(items);
    }


    this.getNumSearchItems = function(query, callback) {
        "use strict";

        var numItems = 0;

        /*
        * TODO-lab2B
        *
        * LAB #2B: Using the value of the query parameter passed to this
        * method, count the number of items in the "item" collection matching
        * a text search. Pass the count to the callback function.
        *
        * getNumSearchItems() depends on the same text index as searchItems().
        * Before implementing this method, ensure that you've already created
        * a SINGLE text index on title, slogan, and description. You should
        * simply do this in the mongo shell.
        */
        var collection = mongoDb.collection('item');
        collection.find({'$text':{'$search':query}}).toArray(function(err, docs) {
                console.dir(docs);
                if (!err) return callback(docs.length);
                console.dir(err);
        });
        // callback(numItems);
    }


    this.getItem = function(itemId, callback) {
        "use strict";

        /*
         * TODO-lab3
         *
         * LAB #3: Implement the getItem() method.
         *
         * Using the itemId parameter, query the "item" collection by
         * _id and pass the matching item to the callback function.
         *
         */

        var item = this.createDummyItem();
        var collection = mongoDb.collection('item');
        collection.findOne({'_id':itemId},function(err, doc) {
                console.dir(doc);
                if (!err) return callback(doc);
                console.dir(err);
        });

        // TODO-lab3 Replace all code above (in this method).

        // TODO Include the following line in the appropriate
        // place within your code to pass the matching item
        // to the callback.
        // callback(item);
    }


    this.getRelatedItems = function(callback) {
        "use strict";

        this.db.collection("item").find({})
            .limit(4)
            .toArray(function(err, relatedItems) {
                assert.equal(null, err);
                callback(relatedItems);
            });
    };


    this.addReview = function(itemId, comment, name, stars, callback) {
        "use strict";

        /*
         * TODO-lab4
         *
         * LAB #4: Implement addReview().
         *
         * Using the itemId parameter, update the appropriate document in the
         * "item" collection with a new review. Reviews are stored as an
         * array value for the key "reviews". Each review has the fields:
         * "name", "comment", "stars", and "date".
         *
         */

        var reviewDoc = {
            name: name,
            comment: comment,
            stars: stars,
            date: Date.now()
        }

        // TODO replace the following two lines with your code that will
        // update the document with a new review.
        // var doc = this.createDummyItem();
        // doc.reviews = [reviewDoc];
	console.dir(reviewDoc);
        var collection = mongoDb.collection('item');
        collection.update({'_id':itemId}, {$push:{'reviews':reviewDoc}},function(err, docs) {
                console.dir(docs);
                if (!err) return callback(docs.length);
                console.dir(err);
        });
        // TODO Include the following line in the appropriate
        // place within your code to pass the updated doc to the
        // callback.
        // callback(doc);
    }


    this.createDummyItem = function() {
        "use strict";

        var item = {
            _id: 1,
            title: "Gray Hooded Sweatshirt",
            description: "The top hooded sweatshirt we offer",
            slogan: "Made of 100% cotton",
            stars: 0,
            category: "Apparel",
            img_url: "/img/products/hoodie.jpg",
            price: 29.99,
            reviews: []
        };

        return item;
    }
}


module.exports.ItemDAO = ItemDAO;
