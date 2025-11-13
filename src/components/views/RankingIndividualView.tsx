// src/components/views/RankingIndividualView.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Box from '../Box'; // Subimos un nivel para encontrar Box.tsx

// Definimos cómo se ve un jugador en el ranking para usarlo con TypeScript
interface RankingPlayer {
    Name: string;
    Level: number;
    XP: number;
}

const RankingIndividualView: React.FC = () => {
    // Estados para guardar los datos, el estado de carga y los errores
    const [rankingData, setRankingData] = useState<RankingPlayer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const apiUrl = `${import.meta.env.VITE_API_URL}/api/ranking/players`;
        axios.get(apiUrl)
            .then(response => {
                setRankingData(response.data);
            })
            .catch(err => {
                console.error("Error al obtener el ranking individual:", err);
                setError("No se pudo cargar el ranking. Inténtalo de nuevo más tarde.");
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []); // El array vacío asegura que se ejecute solo una vez

    // Renderizamos el contenido basado en el estado
    const renderContent = () => {
        if (isLoading) {
            return <p>Cargando ranking...</p>;
        }
        if (error) {
            return <p className="text-red-500">{error}</p>;
        }
        return (
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="p-2 border-b border-gray-300 w-12 text-center">#</th>
                        <th className="p-2 border-b border-gray-300">Nombre</th>
                        <th className="p-2 border-b border-gray-300 text-center">Nivel</th>
                        <th className="p-2 border-b border-gray-300 text-right">Experiencia</th>
                    </tr>
                </thead>
                <tbody>
                    {rankingData.map((player, index) => (
                        <tr key={player.Name} className="hover:bg-gray-100">
                            <td className="p-2 border-b border-gray-200 text-center">{index + 1}</td>
                            <td className="p-2 border-b border-gray-200 font-semibold">{player.Name}</td>
                            <td className="p-2 border-b border-gray-200 text-center">{player.Level}</td>
                            <td className="p-2 border-b border-gray-200 text-right">{player.XP.toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    return (
        <Box title="Ranking Individual">
            <div className="p-4">
                {renderContent()}
            </div>
        </Box>
    );
};

export default RankingIndividualView;