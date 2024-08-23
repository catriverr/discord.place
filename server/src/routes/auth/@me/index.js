const Profile = require('@/schemas/Profile');
const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const useRateLimiter = require('@/utils/useRateLimiter');
const User = require('@/schemas/User');
const getUserHashes = require('@/utils/getUserHashes');

module.exports = {
  get: [
    useRateLimiter({ maxRequests: 20, perMinutes: 1 }),
    checkAuthentication,
    async (request, response) => {
      const user = await User.findOne({ id: request.user.id });
      if (!user) return response.sendError('User not found.', 404);

      const userHashes = await getUserHashes(user.id);

      const profile = await Profile.findOne({ 'user.id': user.id });
      const canViewDashboard = request.member && config.permissions.canViewDashboardRoles.some(roleId => request.member.roles.cache.has(roleId));

      return response.json({
        id: user.id,
        username: user.data.username,
        global_name: user.data.global_name,
        avatar: userHashes.avatar,
        banner: userHashes.banner,
        profile: profile?.slug ? {
          slug: profile.slug
        } : null,
        premium: user?.subscription?.createdAt ? user.subscription : null,
        can_view_dashboard: canViewDashboard
      });
    }
  ]
};