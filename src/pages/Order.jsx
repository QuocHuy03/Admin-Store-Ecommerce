import axios from "axios";
import React, { useEffect, useState } from "react";
import Layout from "../libs/Layout";

export default function Order() {
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [wards, setWards] = useState([]);
  const [selectedWard, setSelectedWard] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        "https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json"
      );
      const data = response.data;
      setCities(data);
    };

    fetchData();
  }, []);

  

  const handleCityChange = (e) => {
    const selectedCityId = e.target.value;
    console.log(selectedCityId)
    setSelectedCity(selectedCityId);

    const selectedCityData = cities.find((city) => city.Id === selectedCityId);
    if (selectedCityData) {
      setDistricts(selectedCityData.Districts);
      setSelectedDistrict("");
      setWards([]);
      setSelectedWard("");
    }
  };

  const handleDistrictChange = (e) => {
    const selectedDistrictId = e.target.value;
    setSelectedDistrict(selectedDistrictId);

    const selectedCityData = cities.find((city) => city.Id === selectedCity);
    if (selectedCityData) {
      const selectedDistrictData = selectedCityData.Districts.find(
        (district) => district.Id === selectedDistrictId
      );
      if (selectedDistrictData) {
        setWards(selectedDistrictData.Wards);
        setSelectedWard("");
      }
    }
  };
  return (
    <Layout>
      <h3>Tỉnh Thành:</h3>
      <select value={selectedCity} onChange={handleCityChange}>
        <option value="">Chọn tỉnh thành</option>
        {cities.map((city) => (
          <option key={city.Id} value={city.Id}>
            {city.Name}
          </option>
        ))}
      </select>

      <h3>Quận Huyện:</h3>
      <select value={selectedDistrict} onChange={handleDistrictChange}>
        <option value="">Chọn quận huyện</option>
        {districts.map((district) => (
          <option key={district.Id} value={district.Id}>
            {district.Name}
          </option>
        ))}
      </select>

      <h3>Xã Phường:</h3>
      <select
        value={selectedWard}
        onChange={(e) => setSelectedWard(e.target.value)}
      >
        <option value="">Chọn phường xã</option>
        {wards.map((ward) => (
          <option key={ward.Id} value={ward.Id}>
            {ward.Name}
          </option>
        ))}
      </select>
    </Layout>
  );
}
