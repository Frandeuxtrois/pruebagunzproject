import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Box from '../Box'; // Para usar tu componente Box


// Definimos cómo se ve un clan en el ranking
interface RankingClan {
    Name: string;
    Wins: number;
    Losses: number;
    Points: number;
}

const RankingClansView: React.FC = () => {
    // Estados para guardar los datos, el estado de carga y los errores
    const [rankingData, setRankingData] = useState<RankingClan[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Obtenemos la URL de la API de la variable de entorno
        const apiUrl = `${import.meta.env.VITE_API_URL}/api/ranking/clans`;
        
        axios.get(apiUrl)
            .then(response => {
                setRankingData(response.data);
            })
            .catch(err => {
                console.error("Error al obtener el ranking de clanes:", err);
                setError("No se pudo cargar el ranking de clanes. Inténtalo de nuevo más tarde.");
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []); // Se ejecuta solo una vez al montar el componente

    // Renderizamos el contenido basado en el estado
    const renderContent = () => {
        if (isLoading) {
            return <p>Cargando ranking de clanes...</p>;
        }
        if (error) {
            return <p className="text-red-500">{error}</p>;
        }
        
        if (rankingData.length === 0) {
            return <p>No hay clanes registrados en el ranking.</p>;
        }

        return (
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="p-2 border-b border-gray-300 w-12 text-center">#</th>
                        <th className="p-2 border-b border-gray-300">Nombre del Clan</th>
                        <th className="p-2 border-b border-gray-300 text-center">Puntos</th>
                        <th className="p-2 border-b border-gray-300 text-center">Victorias</th>
                        <th className="p-2 border-b border-gray-300 text-center">Derrotas</th>
                    </tr>
                </thead>
                <tbody>
                    {rankingData.map((clan, index) => (
                        <tr key={clan.Name} className="hover:bg-gray-100">
                            <td className="p-2 border-b border-gray-200 text-center">{index + 1}</td>
                            <td className="p-2 border-b border-gray-200 font-semibold">{clan.Name}</td>
                            <td className="p-2 border-b border-gray-200 text-center">{clan.Points.toLocaleString()}</td>
                            <td className="p-2 border-b border-gray-200 text-center text-green-600">{clan.Wins.toLocaleString()}</td>
                            <td className="p-2 border-b border-gray-200 text-center text-red-600">{clan.Losses.toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    return (
        <Box title="Ranking de Clanes">
            <div className="p-4">
                {renderContent()}
            </div>
        </Box>
    );
};

export default RankingClansView;