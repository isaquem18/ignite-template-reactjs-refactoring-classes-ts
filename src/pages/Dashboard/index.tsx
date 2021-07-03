import { useState, useEffect } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

type Foods = {
  id: number;
  name: string;
  description: string;
  price: string;
  available: boolean;
  image: string;
}

const Dashboard = ({

}) => {
  const [foods, setFoods] = useState<Foods[]>([]);
  const [editingFood, setEditingFood] = useState<any>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const response = await api.get('/foods');
      setFoods(() => response.data);
    })();
  }, []);

  useEffect(() => {
    console.log(foods);
  }, [foods])

  const handleAddFood = async (food: any) => {
    try {
      const response = await api.post('/foods', {
        ...foods,
        available: true,
      });

      //setFoods((state) => [...state, response.data]);
    } catch (err) {
      console.log(err);
    }
  }

  const handleUpdateFood = async (food: Foods) => {

    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setFoods(foodsUpdated);
    } catch (err) {
      //console.log(err);
    }
  }

  const handleDeleteFood = async (id: number) => {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    setFoods(foodsFiltered);
  }

  const toggleModal = () => {
    setModalOpen((state) => !state);
  }

  const toggleEditModal = () => {
    setEditModalOpen((state) => !editModalOpen);
  }

  const handleEditFood = (food: Foods) => {
    setEditingFood(food);
    setEditModalOpen(true);
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map((food: Foods) => (
            <Food
              key={food.id}
              food={food}
              handleDelete={() => handleDeleteFood(food.id)}
              handleEditFoodProps={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );

};

export default Dashboard;
