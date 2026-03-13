import portfolioRepository  from './portfolio.repository';

const portfolioService = {
    addWork: async (data, tenantId) => {
        return await portfolioRepository.create(data, tenantId);
    },
    getGallery: async (tenantId) => {
        return await portfolioRepository.findGallery(tenantId);
    }
};

export default portfolioService;
