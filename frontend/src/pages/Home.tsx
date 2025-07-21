import CircularGallery from '../components/home/CircularGallery';
const Home = () => {
  return (
    <>
      <div style={{ height: '350px', position: 'relative' }}>
        <CircularGallery bend={3} textColor="#ffffff" borderRadius={0.05} scrollEase={0.02} />
      </div>
      <div className="text-center mt-10 text-3xl font-bold text-gray-700">
        Welcome to IOMS 
      </div>
      <div className="text-center text-sm font-bold text-gray-400">
        Manage your inventory with ease
      </div>
    </>
  );
};

export default Home;
