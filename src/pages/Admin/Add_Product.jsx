import React from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

const Add_Product = () => {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async data => {
    console.log("Form data:", data);

    const productData = {
      name: data.name,
      description: data.description,
      price: parseFloat(data.price),
      image: data.image,
      category: data.category,
    };

    const response = await fetch('http://localhost:5000/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    const responseData = await response.json();

    if (response.ok) {
      console.log("Product added successfully:", responseData);

      // เรียกใช้ SweetAlert2 ที่นี่
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Product added successfully",
        showConfirmButton: false,
        timer: 1500,
      });

      reset(); // รีเซ็ตฟิลด์ฟอร์มหลังจากการส่งข้อมูลสำเร็จ
    } else {
      console.error("Failed to add product:", responseData.message);
      // อาจแสดง SweetAlert2 อีกครั้งเพื่อแจ้งข้อผิดพลาด
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
        <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
          <h1 className="font-bold">Add Product</h1>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              type="text"
              placeholder="Name"
              className="input input-bordered"
              required
              {...register("name")}
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea
              placeholder="Description"
              className="textarea textarea-bordered textarea-sm w-full max-w-xs"
              required
              {...register("description")}
            ></textarea>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Price</span>
            </label>
            <input
              type="number"
              placeholder="Price"
              className="input input-bordered"
              required
              {...register("price")}
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Image URL</span>
            </label>
            <textarea
              placeholder="Image URL"
              className="textarea textarea-bordered textarea-sm w-full max-w-xs"
              required
              {...register("image")}
            ></textarea>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Category</span>
            </label>
            <input
              type="text"
              placeholder="Category"
              className="input input-bordered"
              required
              {...register("category")}
            />
          </div>

          <div className="form-control mt-6">
            <input
              type="submit"
              value="Add Product"
              className="btn bg-red text-white"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Add_Product;
