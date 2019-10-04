import { normalize, schema } from "normalizr";

let data, mySchema, result;

// simple example

data = { users: [{ id: 1 }, { id: 10 }] };
mySchema = new schema.Object({
  users: new schema.Array(new schema.Entity("users"))
});
result = normalize(data, mySchema);
console.log(JSON.stringify(result));

// using schema.Object

data = { users: [{ id: 1 }, { id: 10 }] };
mySchema = new schema.Object({
  users: new schema.Array(new schema.Entity("TEST_NAME"))
});
result = normalize(data, mySchema);
console.log(JSON.stringify(result));

// separate by type

data = { users: [{ id: 1, type: "a" }, { id: 10, type: "b" }] };
mySchema = new schema.Object({
  users: new schema.Array(
    {
      a: new schema.Entity("TEST_A"),
      b: new schema.Entity("TEST_B")
    },
    input => input.type
  )
});
result = normalize(data, mySchema);
console.log(JSON.stringify(result));

// deep nested example

data = {
  id: "123",
  title: "My Title",
  author: {
    id: 1,
    name: "Cool author name"
  },
  comments: [
    {
      id: 11,
      commenter: {
        id: 1,
        name: "Cool author name"
      },
      content: "This is my first comment"
    }
  ]
};

const user = new schema.Entity("users");
const comment = new schema.Entity("comments", {
  commenter: user
});

const article = new schema.Entity("articles", {
  author: user,
  comments: [comment]
});

const normalizedData = normalize(data, article);
console.log(JSON.stringify(normalizedData));

data = {
  users: [{ id: 1, name: "Joy" }, { id: 2, name: "Tom" }],
  orders: [
    {
      id: 11,
      quantity: 2,
      order_user: {
        id: 1,
        name: "Joy"
      }
    },
    {
      id: 12,
      quantity: 3,
      order_user: {
        id: 1,
        name: "Joy"
      }
    },
    {
      id: 13,
      quantity: 4,
      order_user: {
        id: 2,
        name: "Tom"
      }
    }
  ]
};

const userSchema = new schema.Entity("users");
const orderSchema = new schema.Entity("orders", {
  order_user: userSchema
});

mySchema = {
  users: [userSchema],
  orders: [orderSchema]
};
result = normalize(data, mySchema);
console.log(JSON.stringify(result));

// expect result
// {
//   entities: {
//     users: { "1": { id: 1, name: "Joy" }, "2": { id: 2, name: "Tom" } },
//     orders: {
//       "11": { id: 11, quantity: 2, order_user: 1 },
//       "12": { id: 12, quantity: 3, order_user: 1 },
//       "13": { id: 13, quantity: 4, order_user: 2 }
//     }
//   },
//   result: { users: [1, 2], orders: [11, 12, 13] }
// };
