
import Todo from "../models/Todo.js";




export const getTodo = async(req, res)=>{
  try {
    const userId = req.user.id;
    const allTodos = await Todo.find({userId});

    res.status(200).json({
        message: "All todos are fetched sucessfully",
        data: allTodos
    })
  } catch (error) {
    console.error(error);
    res.status(500).json({message: "Internal server Error"})
  }
}

export const updatedTodoupdateTodo = async (req, res)=>{
    try {
        const todoId  = req.params.id;
        const update = req.body;
        const updatedTodo = await Todo.findByIdAndUpdate(todoId, update, {new : true} );

        if(!updatedTodo){
            return res.status(404).json({

                message: "Todo Not Found",
            })
        }
        res.status(200).json({
            message: "Updated Sucessfully",
            data : updatedTodo
        })

    } catch (error) {
    console.error(error);
    res.status(500).json({message: "Internal server Error"})
    }
}

export const deleteTodo = async (req, res)=>{

    try {
        const todoId  = req.params.id;

    const deleteTodo = await Todo.findByIdAndDelete(todoId);
    if(!deleteTodo){
         return res.status(404).json({

                message: "Todo Not Found",
            })
    }

    res.status(200).json({
            message: "Todo deleted successfully",
            deleteTodo
        })
    } catch (error) {
        console.error(error);
    res.status(500).json({message: "Internal server Error"})
    }
}

export const addTodo = async(req, res)=>{
    try {
        const {title, description}  = req.body;
        const userId = req.user.id;

       const todoData=  await Todo.create({
            title: title,
            description: description,
            userId: userId,
        })

        res.status(201).json({
            message:"Todo added SucessFully",
            todoData
        })

    } catch (error) {
        console.error("Signup Error:", error);
    res.status(500).json({ message: "Server error" });
    }
}