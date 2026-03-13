import Portfolio  from './portfolio.model';
import Stylist  from '../stylist/stylist.model';

const portfolioRepository = {
    create: async (data, tenantId) => {
        return await Portfolio.create({ ...data, tenantId });
    },
    findGallery: async (tenantId) => {
        return await Portfolio.findAll({ where: { tenantId }, include: [Stylist] });
    }
};

export default portfolioRepository;
