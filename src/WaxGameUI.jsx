import React, { useState, useEffect } from "react";
import { useUAL } from "ual-reactjs-renderer";
import AnchorLogin from "./AnchorLogin";

const tools = {
  lomata: { name: "Ломата", rarity: "Common", tokenPower: 5, crystalPower: 1 },
  kirka: { name: "Кирка", rarity: "Rare", tokenPower: 12, crystalPower: 3 },
  drel: { name: "Дрель", rarity: "Legendary", tokenPower: 25, crystalPower: 7 }
};

const missions = [
  { id: 1, name: "Пустошь", energyType: "heat", energyCost: 10 },
  { id: 2, name: "Пещера", energyType: "cold", energyCost: 50 },
  { id: 3, name: "Кратер", energyType: "void", energyCost: 100 }
];

const energySettings = {
  heat: { max: 10, regenInterval: 30 * 1000 },
  cold: { max: 50, regenInterval: 60 * 1000 },
  void: { max: 100, regenInterval: 90 * 1000 }
};

function formatTime(ms) {
  const totalSec = Math.ceil(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min > 0 ? min + 'м ' : ''}${sec}с`;
}

export default function WaxGameUI() {
  const { activeUser, login, logout, isLoading } = useUAL();
  const [user, setUser] = useState(() => ({
    tokens: 0,
    crystals: 0,
    inventory: [
      { id: "nft_1", type: "lomata", ...tools["lomata"] }
    ],
    energy: {
      heat: energySettings.heat.max,
      cold: energySettings.cold.max,
      void: energySettings.void.max
    },
    timers: {
      heat: Date.now(),
      cold: Date.now(),
      void: Date.now()
    }
  }));

  const [now, setNow] = useState(Date.now());
  const [tab, setTab] = useState("missions");
  const [selectedMission, setSelectedMission] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
      const updatedEnergy = { ...user.energy };
      const updatedTimers = { ...user.timers };
      let changed = false;

      ["heat", "cold", "void"].forEach((type) => {
        if (user.energy[type] < energySettings[type].max) {
          if (Date.now() - user.timers[type] >= energySettings[type].regenInterval) {
            updatedEnergy[type] += 1;
            updatedTimers[type] = Date.now();
            changed = true;
          }
        }
      });

      if (changed) {
        setUser((prev) => ({ ...prev, energy: updatedEnergy, timers: updatedTimers }));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [user]);

  const runMission = (missionId, nftId) => {
    const mission = missions.find((m) => m.id === missionId);
    const nft = user.inventory.find((n) => n.id === nftId);
    if (!mission || !nft) return alert("Ошибка: нет миссии или инструмента.");

    const energyType = mission.energyType;
    const cost = mission.energyCost;

    if (user.energy[energyType] < cost) return alert(`❌ Недостаточно ${energyType}-энергии.`);

    const newUser = { ...user };
    newUser.energy[energyType] -= cost;
    newUser.tokens += nft.tokenPower;
    newUser.crystals += nft.crystalPower;
    newUser.timers[energyType] = Date.now();
    setUser(newUser);
    alert(`✅ ${mission.name} завершена! Получено ${nft.tokenPower} $CORE и ${nft.crystalPower} кристаллов.`);
    setSelectedMission(null);
  };

  const allEnergyFull = Object.entries(user.energy).every(
    ([type, val]) => val === energySettings[type].max
  );

  return (
    <div className="p-4 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">🌌 Командный Центр</h1>

      {isLoading && <p>Загрузка...</p>}

      {!activeUser ? (
        <button
          onClick={login}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Войти через Anchor
        </button>
      ) : (
        <div className="space-y-2">
          <p>✅ Вы вошли как: <strong>{activeUser.getAccountName()}</strong></p>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Выйти
          </button>
        </div>
      )}

      <div>
        <p>💰 Токены: {user.tokens} $CORE</p>
        <p>🔹 Кристаллы: {user.crystals}</p>
      </div>

      <div>
        <h2 className="text-lg font-semibold">⚡ Энергия</h2>
        <ul>
          {Object.entries(user.energy).map(([key, val]) => {
            const nextIn = Math.max(0, energySettings[key].regenInterval - (now - user.timers[key]));
            return (
              <li key={key}>
                {key}: {val} / {energySettings[key].max}
                {val < energySettings[key].max && (
                  <> — +1 через {formatTime(nextIn)}</>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="flex space-x-4">
        <button
          className={`px-4 py-2 rounded ${tab === "missions" ? "bg-purple-700 text-white" : "bg-gray-300"}`}
          onClick={() => setTab("missions")}
        >
          🚀 Миссии
        </button>
        <button
          className={`px-4 py-2 rounded ${tab === "inventory" ? "bg-purple-700 text-white" : "bg-gray-300"}`}
          onClick={() => setTab("inventory")}
        >
          🎴 Инвентарь
        </button>
      </div>

      {tab === "missions" && (
        <div className="p-4 bg-gray-100 border rounded space-y-4">
          {!selectedMission ? (
            <div className="grid grid-cols-3 gap-4">
              {missions.map((mission) => (
                <div
                  key={mission.id}
                  className="bg-white p-4 rounded shadow cursor-pointer hover:bg-blue-100"
                  onClick={() => setSelectedMission(mission)}
                >
                  <h3 className="text-center font-semibold">{mission.name}</h3>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center space-y-4">
              <h2 className="text-xl font-semibold">{selectedMission.name}</h2>
              <p>Энергия: {selectedMission.energyCost} ({selectedMission.energyType})</p>
              <button
                className={`px-4 py-2 rounded text-white ${user.energy[selectedMission.energyType] >= selectedMission.energyCost && allEnergyFull ? "bg-green-600" : "bg-gray-400 cursor-not-allowed"}`}
                onClick={() => runMission(selectedMission.id, user.inventory[0].id)}
                disabled={user.energy[selectedMission.energyType] < selectedMission.energyCost || !allEnergyFull}
              >
                Начать прохождение {selectedMission.name}
              </button>
              {!allEnergyFull || user.energy[selectedMission.energyType] < selectedMission.energyCost ? (
                <p className="text-xs text-gray-500 mt-1">Смотри описание</p>
              ) : null}
              <br />
              <button
                className="text-sm text-blue-500 underline"
                onClick={() => setSelectedMission(null)}
              >
                ← Назад ко всем локациям
              </button>
            </div>
          )}
        </div>
      )}

      {tab === "inventory" && (
        <div className="p-4 bg-gray-100 border rounded space-y-2">
          <h2 className="text-lg font-semibold">Ваши предметы:</h2>
          {user.inventory.map((nft) => (
            <div key={nft.id} className="bg-white p-3 rounded shadow">
              <strong>{nft.name}</strong> — +{nft.tokenPower} $CORE, +{nft.crystalPower} 💎
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
