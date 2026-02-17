import List "mo:core/List";
import Stripe "stripe/Stripe";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Map "mo:core/Map";
import Storage "blob-storage/Storage";

import MixinAuthorization "authorization/MixinAuthorization";
import StripeMixin "stripe/StripeMixin";
import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";

// Apply migration on upgrade

actor {
  let accessControlState = AccessControl.initState();
  let stripe = Stripe.init(accessControlState, "usd");
  include StripeMixin(stripe);

  include MixinAuthorization(accessControlState);
  include MixinStorage();

  type Team = {
    #magadhUnited;
    #mithilaPride;
    #seemanchalRiser;
    #bhojpurFighters;
    #patliputraLeaders;
    #tirhutChallengers;
  };

  module Team {
    public func compare(team1 : Team, team2 : Team) : Order.Order {
      let priority = func(team : Team) : Nat {
        switch (team) {
          case (#magadhUnited) { 1 };
          case (#mithilaPride) { 2 };
          case (#seemanchalRiser) { 3 };
          case (#bhojpurFighters) { 4 };
          case (#patliputraLeaders) { 5 };
          case (#tirhutChallengers) { 6 };
        };
      };
      Nat.compare(priority(team1), priority(team2));
    };
  };

  type PlayerCategory = { #batsman; #bowler; #allRounder; #wicketkeeper };

  module PlayerCategory {
    public func compare(cat1 : PlayerCategory, cat2 : PlayerCategory) : Order.Order {
      let priority = func(cat : PlayerCategory) : Nat {
        switch (cat) {
          case (#batsman) { 1 };
          case (#bowler) { 2 };
          case (#allRounder) { 3 };
          case (#wicketkeeper) { 4 };
        };
      };
      Nat.compare(priority(cat1), priority(cat2));
    };
  };

  type CricketExperience = { #academy; #district; #state };

  module CricketExperience {
    public func compare(exp1 : CricketExperience, exp2 : CricketExperience) : Order.Order {
      let priority = func(exp : CricketExperience) : Nat {
        switch (exp) {
          case (#academy) { 1 };
          case (#district) { 2 };
          case (#state) { 3 };
        };
      };
      Nat.compare(priority(exp1), priority(exp2));
    };
  };

  type JerseySize = {
    #s36;
    #m38;
    #l40;
    #xl42;
    #xxl44;
    #xxxl46;
  };

  module JerseySize {
    public func compare(size1 : JerseySize, size2 : JerseySize) : Order.Order {
      let priority = func(size : JerseySize) : Nat {
        switch (size) {
          case (#s36) { 1 };
          case (#m38) { 2 };
          case (#l40) { 3 };
          case (#xl42) { 4 };
          case (#xxl44) { 5 };
          case (#xxxl46) { 6 };
        };
      };
      Nat.compare(priority(size1), priority(size2));
    };
  };

  type PlayerRegistration = {
    name : Text;
    age : Nat;
    contact : Text;
    email : Text;
    aadhaarNumber : Text;
    experience : CricketExperience;
    teamChoice : Team;
    category : PlayerCategory;
    jerseySize : JerseySize;
    paymentStatus : Bool;
    timestamp : Nat;
  };

  type SponsorInquiry = {
    name : Text;
    company : Text;
    contact : Text;
    sponsorshipLevel : Text;
    message : Text;
    timestamp : Nat;
    status : SponsorInquiryStatus;
  };

  type SponsorInquiryStatus = {
    #pending;
    #contacted;
    #confirmed;
    #rejected;
  };

  type TeamInfo = {
    name : Text;
    owner : ?Text;
    logo : ?Text;
    purse : Nat;
    teamType : Team;
  };

  module TeamInfo {
    public func compare(team1 : TeamInfo, team2 : TeamInfo) : Order.Order {
      Team.compare(team1.teamType, team2.teamType);
    };
  };

  type ContentPage = {
    title : Text;
    content : Text;
    lastUpdated : Nat;
  };

  type UserProfile = {
    name : Text;
    email : ?Text;
    phone : ?Text;
  };

  type AdminDashboardStats = {
    totalRegistrations : Nat;
    authenticatedRegistrations : Nat;
    anonymousRegistrations : Nat;
    paidRegistrations : Nat;
    pendingPayments : Nat;
    totalSponsorInquiries : Nat;
    pendingSponsorInquiries : Nat;
    totalTeams : Nat;
  };

  type RegistrationAnalytics = {
    byTeam : [(Team, Nat)];
    byCategory : [(PlayerCategory, Nat)];
    byExperience : [(CricketExperience, Nat)];
    byJerseySize : [(JerseySize, Nat)];
  };

  type FileUpload = {
    id : Text;
    blob : Storage.ExternalBlob;
    name : Text;
    timestamp : Int;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let teamInfos = List.empty<TeamInfo>();
  let authenticatedPlayerRegistrations = Map.empty<Principal, PlayerRegistration>();
  let sponsorInquiries = Map.empty<Nat, SponsorInquiry>();
  let contentPages = Map.empty<Text, ContentPage>();
  let anonymousPlayerRegistrations = Map.empty<Text, PlayerRegistration>();
  let files = Map.empty<Text, FileUpload>();

  var sponsorInquiryCounter : Nat = 0;
  var fileCounter : Nat = 0;
  var adminCount : Nat = 0;

  public query ({ caller }) func isSystemBootstrapNeeded() : async Bool {
    // Bootstrap is needed if no admin principal is registered yet.
    // Public access - needed for UI to determine if "Become First Admin" should be shown
    adminCount == 0;
  };

  // Track admin assignments to maintain accurate count
  public shared ({ caller }) func becomeFirstAdmin() : async () {
    if (adminCount > 0) {
      Runtime.trap("System already has an admin");
    };
    AccessControl.initialize(accessControlState, caller, "", "");
    adminCount += 1;
  };

  // Override assignRole to track admin count
  public shared ({ caller }) func assignRole(user : Principal, role : AccessControl.UserRole) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can assign roles");
    };

    let oldRole = AccessControl.getUserRole(accessControlState, user);
    AccessControl.assignRole(accessControlState, caller, user, role);

    // Update admin count
    switch (oldRole, role) {
      case (#admin, #admin) { /* no change */ };
      case (#admin, _) { adminCount -= 1 };
      case (_, #admin) { adminCount += 1 };
      case (_, _) { /* no change */ };
    };
  };

  // Stripe price setup for player registration - ADMIN ONLY
  public shared ({ caller }) func setupStripePrices() : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can setup Stripe prices");
    };
    stripe.addStripePrice(caller, {
      priceId = "player_registration";
      name = "Player Registration";
      description = "Bihar Cricket Mahotsav player registration fee";
      unitAmount = 149900; // ₹1,499 in paise
    });
  };

  // Get caller ID as text - Public (for debugging)
  public query ({ caller }) func getCallerIdAsText() : async Text {
    caller.toText();
  };

  // Checkout for player registration - USER ONLY
  public shared ({ caller }) func checkout() : async Stripe.CreatePaymentResponse {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can checkout");
    };
    await Stripe.createPayment(
      stripe,
      caller,
      [{
        priceId = "player_registration";
        quantity = 1;
        comment = ?("Player Registration");
      }],
      "/payment-success",
      "/payment-cancel",
    );
  };

  // User Profile Management - USER ONLY
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile or admin can view any profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Player Registration - ALLOWS GUEST ACCESS for anonymous registrations
  public shared ({ caller }) func submitPlayerRegistration(
    name : Text,
    age : Nat,
    contact : Text,
    email : Text,
    aadhaarNumber : Text,
    experience : CricketExperience,
    teamChoice : Team,
    category : PlayerCategory,
    jerseySize : JerseySize,
    paymentStatus : Bool,
    userId : ?Text,
    anonymous : Bool,
  ) : async () {
    // Validate Aadhaar number format (12 digits)
    if (aadhaarNumber.size() != 12) {
      Runtime.trap("Invalid Aadhaar number: must be exactly 12 digits");
    };

    // Validate age
    if (age < 15 or age > 50) {
      Runtime.trap("Invalid age: must be between 15 and 50");
    };

    let registration = {
      name;
      age;
      contact;
      email;
      aadhaarNumber;
      experience;
      teamChoice;
      category;
      jerseySize;
      paymentStatus;
      timestamp = 0; // In production, use Time.now()
    };

    if anonymous {
      // Anonymous registration - no authentication required (guest access allowed)
      switch (userId) {
        case (null) { Runtime.trap("Anonymous userId required for anonymous registration") };
        case (?id) {
          // Check for duplicate anonymous registration
          if (anonymousPlayerRegistrations.containsKey(id)) {
            Runtime.trap("This anonymous user has already registered");
          };
          // Check for duplicate Aadhaar across all registrations
          for ((_, reg) in authenticatedPlayerRegistrations.entries()) {
            if (reg.aadhaarNumber == aadhaarNumber) {
              Runtime.trap("A player with this Aadhaar number is already registered");
            };
          };
          for ((_, reg) in anonymousPlayerRegistrations.entries()) {
            if (reg.aadhaarNumber == aadhaarNumber) {
              Runtime.trap("A player with this Aadhaar number is already registered");
            };
          };
          anonymousPlayerRegistrations.add(id, registration);
        };
      };
    } else {
      // Authenticated registration - requires user role
      if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
        Runtime.trap("Unauthorized: Only authenticated users can submit non-anonymous registrations");
      };
      // Check for duplicate authenticated registration
      if (authenticatedPlayerRegistrations.containsKey(caller)) {
        Runtime.trap("You have already registered as a player");
      };
      // Check for duplicate Aadhaar across all registrations
      for ((_, reg) in authenticatedPlayerRegistrations.entries()) {
        if (reg.aadhaarNumber == aadhaarNumber) {
          Runtime.trap("A player with this Aadhaar number is already registered");
        };
      };
      for ((_, reg) in anonymousPlayerRegistrations.entries()) {
        if (reg.aadhaarNumber == aadhaarNumber) {
          Runtime.trap("A player with this Aadhaar number is already registered");
        };
      };
      authenticatedPlayerRegistrations.add(caller, registration);
    };
  };

  // Get own registration - USER ONLY
  public query ({ caller }) func getPlayerRegistration() : async ?PlayerRegistration {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can access their registrations");
    };
    authenticatedPlayerRegistrations.get(caller);
  };

  // Get specific user's registration - ADMIN or SELF ONLY
  public query ({ caller }) func getPlayerRegistrationByPrincipal(user : Principal) : async ?PlayerRegistration {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view other players' registrations");
    };
    authenticatedPlayerRegistrations.get(user);
  };

  // Get all authenticated registrations - ADMIN ONLY
  public query ({ caller }) func getAllPlayerRegistrations() : async [(Principal, PlayerRegistration)] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all registrations");
    };
    authenticatedPlayerRegistrations.entries().toArray();
  };

  // Get all anonymous registrations - ADMIN ONLY
  public query ({ caller }) func getAllAnonymousRegistrations() : async [(Text, PlayerRegistration)] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all anonymous registrations");
    };
    anonymousPlayerRegistrations.toArray();
  };

  // Get registration count - ADMIN ONLY
  public query ({ caller }) func getRegistrationCount() : async Nat {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view registration statistics");
    };
    authenticatedPlayerRegistrations.size() + anonymousPlayerRegistrations.size();
  };

  // Update payment status - ADMIN ONLY
  public shared ({ caller }) func updatePlayerPaymentStatus(
    userPrincipal : ?Principal,
    anonymousId : ?Text,
    paymentStatus : Bool,
  ) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update payment status");
    };

    switch (userPrincipal, anonymousId) {
      case (?principal, null) {
        switch (authenticatedPlayerRegistrations.get(principal)) {
          case (null) { Runtime.trap("Player registration not found") };
          case (?reg) {
            let updated = {
              name = reg.name;
              age = reg.age;
              contact = reg.contact;
              email = reg.email;
              aadhaarNumber = reg.aadhaarNumber;
              experience = reg.experience;
              teamChoice = reg.teamChoice;
              category = reg.category;
              jerseySize = reg.jerseySize;
              paymentStatus;
              timestamp = reg.timestamp;
            };
            authenticatedPlayerRegistrations.add(principal, updated);
          };
        };
      };
      case (null, ?id) {
        switch (anonymousPlayerRegistrations.get(id)) {
          case (null) { Runtime.trap("Anonymous player registration not found") };
          case (?reg) {
            let updated = {
              name = reg.name;
              age = reg.age;
              contact = reg.contact;
              email = reg.email;
              aadhaarNumber = reg.aadhaarNumber;
              experience = reg.experience;
              teamChoice = reg.teamChoice;
              category = reg.category;
              jerseySize = reg.jerseySize;
              paymentStatus;
              timestamp = reg.timestamp;
            };
            anonymousPlayerRegistrations.add(id, updated);
          };
        };
      };
      case (_, _) { Runtime.trap("Must provide either userPrincipal or anonymousId, not both") };
    };
  };

  // Sponsor Inquiries - ALLOWS GUEST ACCESS
  public shared ({ caller }) func submitSponsorInquiry(
    name : Text,
    company : Text,
    contact : Text,
    sponsorshipLevel : Text,
    message : Text,
  ) : async Nat {
    // No authentication required - guests can submit sponsor inquiries
    // Check for duplicate by company name
    for ((_, inquiry) in sponsorInquiries.entries()) {
      if (inquiry.company == company) {
        Runtime.trap("An inquiry from this company already exists");
      };
    };

    let inquiryId = sponsorInquiryCounter;
    sponsorInquiryCounter += 1;

    let inquiry = {
      name;
      company;
      contact;
      sponsorshipLevel;
      message;
      timestamp = 0; // In production, use Time.now()
      status = #pending;
    };

    sponsorInquiries.add(inquiryId, inquiry);
    inquiryId;
  };

  // Get all sponsor inquiries - ADMIN ONLY
  public query ({ caller }) func getAllSponsorInquiries() : async [(Nat, SponsorInquiry)] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all sponsor inquiries");
    };
    sponsorInquiries.entries().toArray();
  };

  // Update sponsor inquiry status - ADMIN ONLY
  public shared ({ caller }) func updateSponsorInquiryStatus(
    inquiryId : Nat,
    status : SponsorInquiryStatus,
  ) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update sponsor inquiry status");
    };

    switch (sponsorInquiries.get(inquiryId)) {
      case (null) { Runtime.trap("Sponsor inquiry not found") };
      case (?inquiry) {
        let updated = {
          name = inquiry.name;
          company = inquiry.company;
          contact = inquiry.contact;
          sponsorshipLevel = inquiry.sponsorshipLevel;
          message = inquiry.message;
          timestamp = inquiry.timestamp;
          status;
        };
        sponsorInquiries.add(inquiryId, updated);
      };
    };
  };

  // Delete sponsor inquiry - ADMIN ONLY
  public shared ({ caller }) func deleteSponsorInquiry(inquiryId : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete sponsor inquiries");
    };

    if (not sponsorInquiries.containsKey(inquiryId)) {
      Runtime.trap("Sponsor inquiry not found");
    };

    sponsorInquiries.remove(inquiryId);
  };

  // Team Info - PUBLIC ACCESS (no authentication required for viewing)
  public query ({ caller }) func getSortedTeamInfos() : async [TeamInfo] {
    // Public access - no authentication required
    let teamArray = teamInfos.toArray();
    teamArray.sort();
  };

  public query ({ caller }) func getTeams() : async [TeamInfo] {
    // Public access - no authentication required
    teamInfos.toArray();
  };

  // Add team - ADMIN ONLY
  public shared ({ caller }) func addTeamInfo(
    name : Text,
    owner : ?Text,
    logo : ?Text,
    purse : Nat,
    teamType : Team,
  ) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add teams");
    };
    let team = {
      name;
      owner;
      logo;
      purse;
      teamType;
    };
    teamInfos.add(team);
  };

  // Update team logo - ADMIN ONLY
  public shared ({ caller }) func updateTeamLogo(teamName : Text, logo : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update team logos");
    };
    let currentTeams = teamInfos.toArray();
    teamInfos.clear();
    var found = false;
    for (team in currentTeams.values()) {
      let updatedTeam = if (team.name == teamName) {
        found := true;
        {
          name = team.name;
          owner = team.owner;
          logo = ?logo;
          purse = team.purse;
          teamType = team.teamType;
        };
      } else { team };
      teamInfos.add(updatedTeam);
    };
    if (not found) {
      Runtime.trap("Team not found");
    };
  };

  // Update team purse - ADMIN ONLY
  public shared ({ caller }) func updateTeamPurse(teamName : Text, purse : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update team purses");
    };
    let currentTeams = teamInfos.toArray();
    teamInfos.clear();
    var found = false;
    for (team in currentTeams.values()) {
      let updatedTeam = if (team.name == teamName) {
        found := true;
        {
          name = team.name;
          owner = team.owner;
          logo = team.logo;
          purse;
          teamType = team.teamType;
        };
      } else { team };
      teamInfos.add(updatedTeam);
    };
    if (not found) {
      Runtime.trap("Team not found");
    };
  };

  // Update team details - ADMIN ONLY
  public shared ({ caller }) func updateTeamInfo(
    oldName : Text,
    name : Text,
    owner : ?Text,
    logo : ?Text,
    purse : Nat,
    teamType : Team,
  ) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update team information");
    };
    let currentTeams = teamInfos.toArray();
    teamInfos.clear();
    var found = false;
    for (team in currentTeams.values()) {
      if (team.name == oldName) {
        found := true;
        teamInfos.add({
          name;
          owner;
          logo;
          purse;
          teamType;
        });
      } else {
        teamInfos.add(team);
      };
    };
    if (not found) {
      Runtime.trap("Team not found");
    };
  };

  // Content Management - ADMIN ONLY for updates
  public shared ({ caller }) func updateContent(pageId : Text, title : Text, content : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update content");
    };
    let page = {
      title;
      content;
      lastUpdated = 0; // In production, use Time.now()
    };
    contentPages.add(pageId, page);
  };

  // Get content - PUBLIC ACCESS
  public query ({ caller }) func getContent(pageId : Text) : async ContentPage {
    // Public access - no authentication required for viewing content
    switch (contentPages.get(pageId)) {
      case (null) { Runtime.trap("Requested page does not exist") };
      case (?page) { page };
    };
  };

  // List all content pages - ADMIN ONLY
  public query ({ caller }) func getAllContentPages() : async [(Text, ContentPage)] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all content pages");
    };
    contentPages.entries().toArray();
  };

  // Delete content page - ADMIN ONLY
  public shared ({ caller }) func deleteContentPage(pageId : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete content pages");
    };
    if (not contentPages.containsKey(pageId)) {
      Runtime.trap("Content page not found");
    };
    contentPages.remove(pageId);
  };

  // Admin Dashboard Statistics - ADMIN ONLY
  public query ({ caller }) func getAdminDashboardStats() : async AdminDashboardStats {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view dashboard statistics");
    };

    var paidCount = 0;
    var pendingCount = 0;

    for ((_, reg) in authenticatedPlayerRegistrations.entries()) {
      if (reg.paymentStatus) {
        paidCount += 1;
      } else {
        pendingCount += 1;
      };
    };

    for ((_, reg) in anonymousPlayerRegistrations.entries()) {
      if (reg.paymentStatus) {
        paidCount += 1;
      } else {
        pendingCount += 1;
      };
    };

    var pendingSponsorCount = 0;
    for ((_, inquiry) in sponsorInquiries.entries()) {
      switch (inquiry.status) {
        case (#pending) { pendingSponsorCount += 1 };
        case (_) {};
      };
    };

    {
      totalRegistrations = authenticatedPlayerRegistrations.size() + anonymousPlayerRegistrations.size();
      authenticatedRegistrations = authenticatedPlayerRegistrations.size();
      anonymousRegistrations = anonymousPlayerRegistrations.size();
      paidRegistrations = paidCount;
      pendingPayments = pendingCount;
      totalSponsorInquiries = sponsorInquiries.size();
      pendingSponsorInquiries = pendingSponsorCount;
      totalTeams = teamInfos.size();
    };
  };

  // Registration Analytics - ADMIN ONLY
  public query ({ caller }) func getRegistrationAnalytics() : async RegistrationAnalytics {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view registration analytics");
    };

    let teamCounts = Map.empty<Team, Nat>();
    let categoryCounts = Map.empty<PlayerCategory, Nat>();
    let experienceCounts = Map.empty<CricketExperience, Nat>();
    let jerseySizeCounts = Map.empty<JerseySize, Nat>();

    // Count authenticated registrations
    for ((_, reg) in authenticatedPlayerRegistrations.entries()) {
      let teamCount = switch (teamCounts.get(reg.teamChoice)) {
        case (null) { 1 };
        case (?count) { count + 1 };
      };
      teamCounts.add(reg.teamChoice, teamCount);

      let catCount = switch (categoryCounts.get(reg.category)) {
        case (null) { 1 };
        case (?count) { count + 1 };
      };
      categoryCounts.add(reg.category, catCount);

      let expCount = switch (experienceCounts.get(reg.experience)) {
        case (null) { 1 };
        case (?count) { count + 1 };
      };
      experienceCounts.add(reg.experience, expCount);

      let sizeCount = switch (jerseySizeCounts.get(reg.jerseySize)) {
        case (null) { 1 };
        case (?count) { count + 1 };
      };
      jerseySizeCounts.add(reg.jerseySize, sizeCount);
    };

    // Count anonymous registrations
    for ((_, reg) in anonymousPlayerRegistrations.entries()) {
      let teamCount = switch (teamCounts.get(reg.teamChoice)) {
        case (null) { 1 };
        case (?count) { count + 1 };
      };
      teamCounts.add(reg.teamChoice, teamCount);

      let catCount = switch (categoryCounts.get(reg.category)) {
        case (null) { 1 };
        case (?count) { count + 1 };
      };
      categoryCounts.add(reg.category, catCount);

      let expCount = switch (experienceCounts.get(reg.experience)) {
        case (null) { 1 };
        case (?count) { count + 1 };
      };
      experienceCounts.add(reg.experience, expCount);

      let sizeCount = switch (jerseySizeCounts.get(reg.jerseySize)) {
        case (null) { 1 };
        case (?count) { count + 1 };
      };
      jerseySizeCounts.add(reg.jerseySize, sizeCount);
    };

    {
      byTeam = teamCounts.entries().toArray();
      byCategory = categoryCounts.entries().toArray();
      byExperience = experienceCounts.entries().toArray();
      byJerseySize = jerseySizeCounts.entries().toArray();
    };
  };

  // Dropdown data endpoints - PUBLIC ACCESS (no authentication required)
  // These are needed for anonymous registration forms
  public query ({ caller }) func listTeams() : async [Team] {
    // Public access - needed for anonymous registration form
    [#magadhUnited, #mithilaPride, #seemanchalRiser, #bhojpurFighters, #patliputraLeaders, #tirhutChallengers];
  };

  public query ({ caller }) func listCategories() : async [PlayerCategory] {
    // Public access - needed for anonymous registration form
    [#batsman, #bowler, #allRounder, #wicketkeeper];
  };

  public query ({ caller }) func listExperienceLevels() : async [CricketExperience] {
    // Public access - needed for anonymous registration form
    [#academy, #district, #state];
  };

  public query ({ caller }) func listJerseySizes() : async [JerseySize] {
    // Public access - needed for registration form
    [#s36, #m38, #l40, #xl42, #xxl44, #xxxl46];
  };

  // File upload - ADMIN ONLY
  public shared ({ caller }) func uploadFile(
    name : Text,
    blob : Storage.ExternalBlob,
  ) : async Text {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can upload files");
    };

    let fileId = "file_" # fileCounter.toText();
    fileCounter += 1;

    let file : FileUpload = {
      id = fileId;
      name;
      blob;
      timestamp = Time.now();
    };

    files.add(fileId, file);
    fileId;
  };

  // Get file by ID - PUBLIC (for viewing uploaded files)
  public query ({ caller }) func getFile(fileId : Text) : async ?FileUpload {
    files.get(fileId);
  };

  // Get all files - ADMIN ONLY
  public query ({ caller }) func getAllFiles() : async [(Text, FileUpload)] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all files");
    };
    files.entries().toArray();
  };

  // Delete file - ADMIN ONLY
  public shared ({ caller }) func deleteFile(fileId : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete files");
    };

    if (not files.containsKey(fileId)) {
      Runtime.trap("File not found");
    };

    files.remove(fileId);
  };

  // Filter files by prefix - PUBLIC (for filtering uploaded files by name)
  public query ({ caller }) func filterFilesByPrefix(prefix : Text) : async [FileUpload] {
    let iter = files.entries();
    let filtered = iter.filter(
      func((id, _)) {
        id.size() >= prefix.size() and id.startsWith(#text prefix)
      }
    );
    filtered.map<(Text, FileUpload), FileUpload>(func((_, file)) { file }).toArray();
  };
};

